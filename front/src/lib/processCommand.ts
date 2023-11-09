import { dev } from "$app/environment";
import { comma } from "postcss/lib/list";

export type CommandResult = {
    input: string;
    textResult: string;
    nextPrefix: string | null;
    callback:
        | ((input: string) => Promise<CommandResult> | CommandResult)
        | null;
};

type User = {
    name: string;
    first_name: string;
    pmr: boolean;
    course: boolean;
    teacher: string[];
    timestamp: string;
    email: string;
    nickname: string | null;
    phone: string;
    study: string;
    comment: string;
};

export function processCommand(command: string): CommandResult {
    if (command === "start") {
        return {
            input: command,
            textResult: `Bienvenue dans le terminal d'inscription à la nuit de l'info !
        Souhaitez-vous créer une nouvelle équipe ou modifier une équipe existante ?
        - Pour créer une nouvelle équipe, tapez "create-team"
        - Pour modifier une équipe existante, tapez "edit-team"
        - Pour vous inscrire en solo, tapez "solo". Vous serez ajouté à une équipe de participant·es solo., 
        `,
            nextPrefix: null,
            callback: null,
        };
    } else if (command === "create-team") {
        return createTeam(command);
    } else if (command === "edit-team") {
        return editTeam(command);
    } else if (command === "solo") {
        return solo(command);
    }

    return {
        input: command,
        textResult: "Commande inconnue : utiliser start pour commencer",
        nextPrefix: null,
        callback: null,
    };
}

function createTeam(command: string): CommandResult {
    const CREATE_TEAM =
        "[<span class='text-indigo-400 font-bold'>CREATE-TEAM</span>]";
    let teamParams: {
        teamName: string;
        members: User[];
        howDidYouHear: string;
    } = {
        teamName: "",
        members: [
            {
                first_name: "",
                name: "",
                email: "",
                nickname: null,
                phone: "",
                course: false,
                teacher: [""],
                timestamp: Date.now().toString(),
                study: "",
                pmr: false,
                comment: "",
            },
        ],
        howDidYouHear: "",
    };

    return {
        input: command,
        textResult: `${CREATE_TEAM} --- Lancement de la création d'équipe. ---
        `,
        nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Nom d'équipe</span> :`,
        callback: onTeamName,
    };

    function onTeamName(teamName: string) {
        teamParams.teamName = teamName;

        return {
            input: teamName,
            textResult: `${CREATE_TEAM} 
            
            ${MEMBER} ---- Ajout du premier membre ----`,
            nextPrefix: `${MEMBER} <span class='font-bold'>Prénom</span> :`,
            callback: memberInfosBranch((input: string, member: User) => {
                teamParams.members[0] = member;
                return {
                    input: input,
                    textResult: `${CREATE_TEAM}`,
                    nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Souhaites-tu ajouter un membre supplémentaire à ton équipe ? Il n'y a pas de limite au nombre de membre par équipe</span> (oui/non) :`,
                    callback: (input: string) => nextMemberOrEnd(input, 0),
                };
            }),
        };
    }

    function nextMemberOrEnd(
        input: string,
        memberIndex: number
    ): CommandResult {
        if (input === "oui") {
            return {
                input: input,
                textResult: `${CREATE_TEAM}  Lancement de la procédure d'ajout d'un nouveau membre.
                ${CREATE_TEAM} ----- Ajout du <span class="font-bold">membre ${
                    memberIndex + 2
                }</span> à l'équipe -----`,
                nextPrefix: `${MEMBER} <span class='font-bold'>Prénom</span> :`,
                callback: memberInfosBranch((input: string, member: User) => {
                    teamParams.members.push(member);
                    return {
                        input: input,
                        textResult: `${CREATE_TEAM}`,
                        nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Souhaites-tu ajouter un membre supplémentaire à ton équipe ? Il n'y a pas de limite au nombre de membre par équipe</span> (oui/non) :`,
                        callback: (input: string) =>
                            nextMemberOrEnd(input, memberIndex + 1),
                    };
                }),
            };
        } else if (input === "non") {
            return {
                input: input,
                textResult: `${CREATE_TEAM}`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Comment avez-vous entendu parler de la nuit de l'info à l'ISTIC ?</span> :`,
                callback: onHowDidYouHear,
            };
        } else {
            return {
                input: input,
                textResult: `${CREATE_TEAM} Veuillez répondre par oui ou non`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Souhaites-tu ajouter un membre supplémentaire à ton équipe ?</span> (pas de limite de membre):`,
                callback: (input) => nextMemberOrEnd(input, memberIndex),
            };
        }
    }

    async function onHowDidYouHear(
        howDidYouHear: string
    ): Promise<CommandResult> {
        teamParams.howDidYouHear = howDidYouHear;

        const hostname = window.location.hostname;
        const port = 8000;
        let createTeamURL = `https://${hostname}:${port}/createTeam/${teamParams.teamName}`;

        if (dev) {
            createTeamURL = `http://localhost:8000/createTeam/${teamParams.teamName}`;
        }

        let resp = await fetch(createTeamURL);
        let respText = await resp.text();

        if (resp.status >= 400) {
            return {
                input: howDidYouHear,
                textResult: `[<span class="text-red-400 font-bold">ERREUR</span>] ${respText}`,
                nextPrefix: null,
                callback: null,
            };
        }

        const password = respText;

        let proms = [];
        let addMemberURL = `https://${hostname}:${port}/joinTeam/${teamParams.teamName}/${password}`;

        if (dev) {
            addMemberURL = `http://localhost:8000/joinTeam/${teamParams.teamName}/${password}`;
        }

        for (let member of teamParams.members) {
            proms.push(
                fetch(addMemberURL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: member.name,
                        first_name: member.first_name,
                        pmr: member.pmr,
                        course: member.course,
                        teacher: member.teacher,
                        email: member.email,
                        timestamp: Date.now().toString(),
                        nickname: "",
                        phone: member.phone,
                        study: member.study,
                        comment: "",
                    }),
                })
            );
        }

        let resps = await Promise.all(proms)

        if(resps.some(r => r.status >= 400)) {
            return {
                input: howDidYouHear,
                textResult: `[<span class="text-red-400 font-bold">ERREUR</span>] ${await resps.find(r => r.status >= 400)?.text()}`,
                nextPrefix: null,
                callback: null,
            }  
        }

        return {
            input: howDidYouHear,
            textResult: `${CREATE_TEAM} Félicitations, votre équipe a été créée avec succès !
            Récapitulaif de votre équipe :
            ${CREATE_TEAM} - Nom d'équipe : <span class="text-red">${teamParams.teamName}</span>
            ${CREATE_TEAM} - Membres : 
            ${teamParams.members.map(
                (m) =>
                    `<span class="text-red">${m.first_name} ${m.name}</span> \n`
            )}
            
            <span class="font-bold text-lg">(!) Mot de passe d'équipe : <span class="text-red">${password}</span></span>
            ${CREATE_TEAM} Ce mot de passe doit être conservé précieusement, il pourra vous servir à modifier votre équipe (ajouter ou supprimer des membres).
            ${CREATE_TEAM} Votre inscription est terminée. Pour modifier votre équipe, tapez "edit-team".`,
            nextPrefix: null,
            callback: null,
        };
    }
}

function solo(command: string): CommandResult {
    const REGISTRATION =
        "[<span class='text-indigo-400 font-bold'>REGISTRATION</span>]";

    return {
        input: command,
        textResult: `Lancement de la procédure d'inscription en solo.
        `,
        nextPrefix: `${REGISTRATION} <span class='font-bold'>Prénom</span> :`,
        callback: memberInfosBranch((input: string, member: User) => {
            return {
                input: input,
                textResult: ``,
                nextPrefix: `${REGISTRATION} <span class='font-bold'>Comment avez-vous entendu parler de la nuit de l'info à l'ISTIC ?</span> :`,
                callback: () => onHowDidYouHear(input, member),
            };
        }),
    };

    async function onHowDidYouHear(
        howDidYouHear: string,
        member: User
    ): Promise<CommandResult> {
        const hostname = window.location.hostname;
        const port = 8000;

        let addMemberURL = `https://${hostname}:${port}/joinSolo`;

        if (dev) {
            addMemberURL = `http://localhost:8000/joinSolo`;
        }

        let resp = await fetch(addMemberURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: member.name,
                first_name: member.first_name,
                pmr: member.pmr,
                course: member.course,
                teacher: member.teacher,
                email: member.email,
                timestamp: Date.now().toString(),
                nickname: "",
                phone: member.phone,
                study: member.study,
                comment: howDidYouHear,
            }),
        });

        if (resp.status >= 400) {
            return {
                input: howDidYouHear,
                textResult: `[<span class="text-red-400 font-bold">ERREUR</span>] ${await resp.text()}`,
                nextPrefix: null,
                callback: null,
            };
        }

        return {
            input: howDidYouHear,
            textResult: `${REGISTRATION} Votre inscription est terminée. Vous allez être ajouté·e à une équipe de participant·es solo.`,
            nextPrefix: null,
            callback: null,
        };
    }
}

function editTeam(command: string): CommandResult {
    const EDIT_TEAM =
        "[<span class='text-indigo-400 font-bold'>TEAM EDITOR</span>]";

    let team = {
        name: "",
        password: "",
    };

    let parsedTeam: {
        members: User[];
    };

    return {
        input: command,
        textResult: "---- Editeur d'équipe ----",
        nextPrefix: `${EDIT_TEAM} Nom d'équipe :`,
        callback: onTeamName,
    };

    function onTeamName(teamName: string): CommandResult {
        team.name = teamName;
        return {
            input: teamName,
            textResult: ``,
            nextPrefix: `${EDIT_TEAM} Mot de passe d'équipe : `,
            callback: onPassword,
        };
    }

    async function onPassword(password: string): Promise<CommandResult> {
        team.password = password;

        const hostname = window.location.hostname;
        const port = 8000;
        let dumpTeamURL = `https://${hostname}:${port}/dumpTeam/${team.name}/${team.password}`;

        if (dev) {
            dumpTeamURL = `http://localhost:8000/dumpTeam/${team.name}/${team.password}`;
        }

        let resp = await fetch(dumpTeamURL);
        if (resp.status >= 400) {
            return {
                input: password,
                textResult: `[<span class="text-red-400 font-bold">ERREUR</span>] ${await resp.text()}`,
                nextPrefix: null,
                callback: null,
            };
        }

        parsedTeam = await resp.json();

        return {
            input: password,
            textResult: `${EDIT_TEAM} Team ${team.name}
            ${EDIT_TEAM} Votre équipe contient ${
                parsedTeam.members.length
            } équipier·es :
            ${parsedTeam.members.map((m) => `- ${m.first_name} ${m.name} \n`)}

            ${EDIT_TEAM} Vous pouvez supprimer ou ajouter un membre dans votre équiper.
            ${EDIT_TEAM} - <span class="font-bold">rm</span> : supprimer un membre
            ${EDIT_TEAM} - <span class="font-bold">add</span> : ajouter un membre
            ${EDIT_TEAM} - <span class="font-bold">quit</span> : Quitter l'éditeur d'équipe
            ${EDIT_TEAM} Votre commande (rm/add) :`,
            nextPrefix: `${EDIT_TEAM} >> `,
            callback: onEditionCommandChoosed,
        };
    }

    function onEditionCommandChoosed(command: string): CommandResult {
        if (command != "add" && command != "rm" && command != "quit") {
            return {
                input: command,
                textResult: `${EDIT_TEAM} Veuillez utiliser une des commandes suivantes :
                ${EDIT_TEAM} - <span class="font-bold">rm</span> : supprimer un membre
                ${EDIT_TEAM} - <span class="font-bold">add</span> : ajouter un membre 
                ${EDIT_TEAM} - <span class="font-bold">quit</span> : quitter l'éditeur d'équipe 
                ${EDIT_TEAM} Votre commande (rm/add/quit) :`,
                nextPrefix: `${EDIT_TEAM} >> `,
                callback: onEditionCommandChoosed,
            };
        } else if (command == "add") {
            return {
                input: command,
                textResult: `--- Ajout d'un nouveau membre ---`,
                nextPrefix: `${MEMBER} Prénom : `,
                callback: memberInfosBranch(
                    async (input: string, member: User) => {
                        const hostname = window.location.hostname;
                        const port = 8000;
                        let joinTeamURL = `https://${hostname}:${port}/joinTeam/${team.name}/${team.password}`;

                        if (dev) {
                            joinTeamURL = `http://localhost:8000/joinTeam/${team.name}/${team.password}`;
                        }

                        let resp = await fetch(joinTeamURL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                ...member,
                                timestamp: Date.now().toString(),
                                comment:
                                    parsedTeam.members.length > 0
                                        ? parsedTeam.members[
                                              parsedTeam.members.length - 1
                                          ].comment
                                        : "",
                            }),
                        });

                        if (resp.status >= 400) {
                            return {
                                input,
                                textResult: `[<span class="text-red-400 font-bold">ERREUR</span>] ${await resp.text()}`,
                                nextPrefix: null,
                                callback: null,
                            };
                        }

                        return {
                            input,
                            textResult: `${EDIT_TEAM} Ajout du membre en cours...
                        ${EDIT_TEAM} Membre ajouté avec succès !
                        ${EDIT_TEAM} Pour continuer, Veuillez utiliser une des commandes suivantes :
                        ${EDIT_TEAM} - <span class="font-bold">rm</span> : supprimer un membre
                        ${EDIT_TEAM} - <span class="font-bold">add</span> : ajouter un membre 
                        ${EDIT_TEAM} - <span class="font-bold">quit</span> : Quitter l'éditeur d'équipe 
                        ${EDIT_TEAM} Votre commande (rm/add/quit) :`,
                            nextPrefix: `${EDIT_TEAM} >> `,
                            callback: onEditionCommandChoosed,
                        };
                    }
                ),
            };
        } else if (command == "rm") {
            return {
                input: command,
                textResult: `--- Suppression d'un membre ---
                ${parsedTeam.members.map(
                    (m, i) => `${i + 1} - ${m.first_name} ${m.name} \n`
                )}}`,
                nextPrefix: `${EDIT_TEAM} Numéro du membre à supprimer : `,
                callback: onMemberIndexChoosed,
            };
        } else {
            return {
                input: command,
                textResult: "",
                nextPrefix: null,
                callback: null,
            };
        }
    }

    async function onMemberIndexChoosed(indexString: string): Promise<CommandResult> {
        let index = parseInt(indexString);
        if (
            Number.isNaN(index) ||
            index < 1 ||
            index > parsedTeam.members.length
        ) {
            return {
                input: indexString,
                textResult: `${EDIT_TEAM} Veuillez entrer un numéro correspondant à un membre`,
                nextPrefix: `${EDIT_TEAM} Numéro du membre à supprimer : `,
                callback: onMemberIndexChoosed,
            };
        }

        const hostname = window.location.hostname;
        const port = 8000;
        let removeMemberURL = `https://${hostname}:${port}/removeUser/${team.name}/${team.password}`;

        if (dev) {
            removeMemberURL = `http://localhost:8000/removeUser/${team.name}/${team.password}`;
        }

        let resp = await fetch(removeMemberURL, {
            method: "POST",
            body: parsedTeam.members[index - 1].email, 
        })

        if(resp.status >= 400) {
            return {
                input: indexString,
                textResult: `[<span class="text-red-400 font-bold">ERREUR</span>] ${await resp.text()}`,
                nextPrefix: null,
                callback: null,
            };
        }

        return {
            input: indexString,
            textResult: `${EDIT_TEAM} Membre supprimé avec succès !
            ${EDIT_TEAM} Pour continuer, Veuillez utiliser une des commandes suivantes :
            ${EDIT_TEAM} - <span class="font-bold">rm</span> : supprimer un membre
            ${EDIT_TEAM} - <span class="font-bold">add</span> : ajouter un membre 
            ${EDIT_TEAM} - <span class="font-bold">quit</span> : Quitter l'éditeur d'équipe 
            ${EDIT_TEAM} Votre commande (rm/add/quit) :`,
            nextPrefix: `${EDIT_TEAM} >> `,
            callback: onEditionCommandChoosed,
        };
    }
}

const MEMBER = "[<span class='text-indigo-400 font-bold'>MEMBER</span>]";
function memberInfosBranch(
    afterCallback: (
        input: string,
        memberInfos: User
    ) => Promise<CommandResult> | CommandResult
): (input: string) => Promise<CommandResult> | CommandResult {
    let member: User = {
        first_name: "",
        name: "",
        email: "",
        nickname: null,
        phone: "",
        course: false,
        teacher: [""],
        timestamp: Date.now().toString(),
        study: "",
        pmr: false,
        comment: "",
    };

    return onFirstName;

    function onFirstName(firstName: string): CommandResult {
        member.first_name = firstName;

        return {
            input: firstName,
            textResult: ``,
            nextPrefix: `${MEMBER} <span class='font-bold'>Nom de famille</span> :`,
            callback: (input: string) => onLastName(input),
        };
    }

    function onLastName(lastName: string): CommandResult {
        member.name = lastName;

        return {
            input: lastName,
            textResult: ``,
            nextPrefix: `${MEMBER} <span class='font-bold'>Email</span> :`,
            callback: (input: string) => onEmail(input),
        };
    }

    function onEmail(email: string): CommandResult {
        //Regex to check if email is valid
        const regex = /\S+@\S+\.\S+/;
        console.log(email, regex.test(email));
        if (!regex.test(email)) {
            return {
                input: email,
                textResult: `${MEMBER} Veuillez entrer une adresse email valide`,
                nextPrefix: `${MEMBER} <span class='font-bold'>Email</span> :`,
                callback: (input: string) => onEmail(input),
            };
        }

        member.email = email;

        return {
            input: email,
            textResult: ``,
            nextPrefix: `${MEMBER} <span class='font-bold'>Téléphone</span> :`,
            callback: (input: string) => onPhone(input),
        };
    }

    function onPhone(phone: string): CommandResult {
        const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!regex.test(phone)) {
            return {
                input: phone,
                textResult: `${MEMBER} Veuillez entrer un numéro de téléphone valide (séparateur : aucun, espace, point ou tiret))`,
                nextPrefix: `${MEMBER} <span class='font-bold'>Téléphone</span> :`,
                callback: (input: string) => onPhone(input),
            };
        }

        member.phone = phone;

        return {
            input: phone,
            textResult: ``,
            nextPrefix: `${MEMBER} <span class='font-bold'>Pseudo discord</span> (Facultatif, laissez vide) :`,
            callback: (input: string) => onDiscord(input),
        };
    }

    function onDiscord(discord: string): CommandResult {
        member.nickname = discord.length > 0 ? discord : null;

        return {
            input: discord,
            textResult: ``,
            nextPrefix: `${MEMBER} <span class='font-bold'>Ce membre a t'il des cours jeudi 7 décembre après 16h30 ou le matin du vendredi 8  ?</span> (oui/non) :`,
            callback: (input: string) => onHasLessons(input),
        };
    }

    function onHasLessons(hasLessonsText: string): CommandResult {
        if (hasLessonsText != "oui" && hasLessonsText != "non") {
            return {
                input: hasLessonsText,
                textResult: `${MEMBER} Veuillez répondre par oui ou non`,
                nextPrefix: `${MEMBER} <span class='font-bold'>Ce membre a t'il cours jeudi 7 décembre après 16h30 ou le matin du vendredi 8  ?</span> (oui/non) :`,
                callback: (input) => onHasLessons(input),
            };
        } else if (hasLessonsText === "oui") {
            member.course = true;
            return {
                input: hasLessonsText,
                textResult: ``,
                nextPrefix: `${MEMBER} <span class='font-bold'>Quels sont les noms professeurs avec qui il a cours ?</span> :`,
                callback: (input: string) => onProfs(input),
            };
        } else {
            return {
                input: hasLessonsText,
                textResult: ``,
                nextPrefix: `${MEMBER} <span class='font-bold'>Formation poursuivie</span> (nom de ta formation) :`,
                callback: (input: string) => onStudies(input),
            };
        }
    }

    function onProfs(professors: string): CommandResult {
        member.teacher = [professors];

        return {
            input: professors,
            textResult: ``,
            nextPrefix: `${MEMBER} <span class='font-bold'>Formation poursuivie</span> (nom de ta formation) :`,
            callback: (input: string) => onStudies(input),
        };
    }

    function onStudies(studies: string): CommandResult {
        member.study = studies;

        return {
            input: studies,
            textResult: ``,
            nextPrefix: `${MEMBER} <span class='font-bold'>Situation de mobilités réduite ?</span> (oui/non) :`,
            callback: (input: string) => onPmr(input),
        };
    }

    function onPmr(pmrText: string): CommandResult | Promise<CommandResult> {
        if (pmrText != "oui" && pmrText != "non") {
            return {
                input: pmrText,
                textResult: `${MEMBER} Veuillez répondre par oui ou non`,
                nextPrefix: `${MEMBER} <span class='font-bold'>Situation de mobilités réduite ?</span> (oui/non) :`,
                callback: (input) => onPmr(input),
            };
        } else {
            const pmr = pmrText === "oui" ? true : false;

            member.pmr = pmr;

            return afterCallback(pmrText, member);
        }
    }
}
