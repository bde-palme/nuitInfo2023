<<<<<<< Updated upstream
import { dev } from "$app/environment";
import { comma } from "postcss/lib/list";

=======
>>>>>>> Stashed changes
export type CommandResult = {
    input: string;
    textResult: string;
    nextPrefix: string | null;
<<<<<<< Updated upstream
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
=======
    callback: ((input: string) => CommandResult) | null;
>>>>>>> Stashed changes
};

export function processCommand(command: string): CommandResult {
    if (command === "start") {
        return {
            input: command,
            textResult: `Bienvenue dans le terminal d'inscription à la nuit de l'info !
        Souhaitez-vous créer une nouvelle équipe ou modifier une équipe existante ?
        - Pour créer une nouvelle équipe, tapez "create-team"
<<<<<<< Updated upstream
        - Pour modifier une équipe existante, tapez "edit-team"
        - Pour vous inscrire en solo, tapez "solo". Vous serez ajouté à une équipe de participant·es solo., 
=======
        - Pour modifier une équipe existante, tapez "edit-team" 
>>>>>>> Stashed changes
        `,
            nextPrefix: null,
            callback: null,
        };
    } else if (command === "create-team") {
        return createTeam(command);
    } else if (command === "edit-team") {
<<<<<<< Updated upstream
        return editTeam(command);
    } else if (command === "solo") {
        return solo(command);
=======
>>>>>>> Stashed changes
    }

    return {
        input: command,
        textResult: "Commande inconnue : utiliser start pour commencer",
        nextPrefix: null,
        callback: null,
    };
}

<<<<<<< Updated upstream
function createTeam(command: string): CommandResult {
    const CREATE_TEAM =
        "[<span class='text-indigo-400 font-bold'>CREATE-TEAM</span>]";
    let teamParams: {
        teamName: string;
        members: User[];
        howDidYouHear: string;
=======
const CREATE_TEAM = "[<span class='text-red-400 font-bold'>CREATE-TEAM</span>]";
function createTeam(command: string): CommandResult {
    let teamParams: {
        teamName: string;
        members: [
            {
                firstName: string;
                lastName: string;
                email: string;
                discord: string | null;
                phone: string;
                hasLessons: boolean | null;
                professors: string;
                studies: string;
                pmr: boolean;
            }
        ];
        howDidYouHear: string;
        solo: boolean;
>>>>>>> Stashed changes
    } = {
        teamName: "",
        members: [
            {
<<<<<<< Updated upstream
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
=======
                firstName: "",
                lastName: "",
                email: "",
                discord: null,
                phone: "",
                hasLessons: null,
                professors: "",
                studies: "",
                pmr: false,
            },
        ],
        howDidYouHear: "",
        solo: false,
    }

    return {
        input: command,
        textResult: `${CREATE_TEAM} Lancement de la création d'équipe.`,
>>>>>>> Stashed changes
        nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Nom d'équipe</span> :`,
        callback: onTeamName,
    };

    function onTeamName(teamName: string) {
        teamParams.teamName = teamName;

        return {
            input: teamName,
            textResult: `${CREATE_TEAM} Ok !
<<<<<<< Updated upstream
            
            ${MEMBER} ---- Ajout du premier membre ----`,
            nextPrefix: `${MEMBER} <span class='font-bold'>Prénom</span> :`,
            callback: memberInfosBranch((input: string, member: User) => {
                teamParams.members[0] = member;
                return {
                    input: input,
                    textResult: `${CREATE_TEAM} Ok !
                    `,
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
                textResult: `${CREATE_TEAM} Ok ! Lancement de la procédure d'ajout d'un nouveau membre.
                ${CREATE_TEAM} ----- Ajout du <span class="font-bold">membre ${
                    memberIndex + 2
                }</span> à l'équipe -----`,
                nextPrefix: `${MEMBER} <span class='font-bold'>Prénom</span> :`,
                callback: memberInfosBranch((input: string, member: User) => {
                    teamParams.members.push(member);
                    return {
                        input: input,
                        textResult: `${CREATE_TEAM} Ok !
                        `,
                        nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Souhaites-tu ajouter un membre supplémentaire à ton équipe ? Il n'y a pas de limite au nombre de membre par équipe</span> (oui/non) :`,
                        callback: (input: string) =>
                            nextMemberOrEnd(input, memberIndex + 1),
                    };
                }),
            };
        } else if (input === "non") {
            return {
                input: input,
                textResult: `${CREATE_TEAM} Ok !
                `,
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
        let createTeamURL = `http://${hostname}:${port}/createTeam/${teamParams.teamName}`;

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
        let addMemberURL = `http://${hostname}:${port}/joinTeam/${teamParams.teamName}/${password}`;

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

        await Promise.all(proms);

        return {
            input: howDidYouHear,
            textResult: `${CREATE_TEAM} Ok !

            ${CREATE_TEAM} Félicitations, votre équipe a été créée avec succès !
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
                textResult: `${REGISTRATION} Ok !
                `,
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

        let addMemberURL = `http://${hostname}:${port}/joinSolo`;

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
            textResult: `${REGISTRATION} Ok !
            ${REGISTRATION} Votre inscription est terminée. Vous allez être ajouté·e à une équipe de participant·es solo.`,
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
            textResult: `Ok !
            `,
            nextPrefix: `${EDIT_TEAM} Mot de passe d'équipe : `,
            callback: onPassword,
        };
    }

    async function onPassword(password: string): Promise<CommandResult> {
        team.password = password;

        const hostname = window.location.hostname;
        const port = 8000;
        let dumpTeamURL = `http://${hostname}:${port}/dumpTeam/${team.name}/${team.password}`;

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
                        let joinTeamURL = `http://${hostname}:${port}/joinTeam/${team.name}/${team.password}`;

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
        let removeMemberURL = `http://${hostname}:${port}/removeUser/${team.name}/${team.password}`;

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
            textResult: `${MEMBER} Ok !
            `,
            nextPrefix: `${MEMBER} <span class='font-bold'>Nom de famille</span> :`,
            callback: (input: string) => onLastName(input),
        };
    }

    function onLastName(lastName: string): CommandResult {
        member.name = lastName;

        return {
            input: lastName,
            textResult: `${MEMBER} Ok !
            `,
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
            textResult: `${MEMBER} Ok !
            `,
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
            textResult: `${MEMBER} Ok !
            `,
            nextPrefix: `${MEMBER} <span class='font-bold'>Pseudo discord</span> (Facultatif, laissez vide) :`,
            callback: (input: string) => onDiscord(input),
        };
    }

    function onDiscord(discord: string): CommandResult {
        member.nickname = discord.length > 0 ? discord : null;

        return {
            input: discord,
            textResult: `${MEMBER} Ok !
            `,
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
                textResult: `${MEMBER} Ok !
                `,
                nextPrefix: `${MEMBER} <span class='font-bold'>Quels sont les noms professeurs avec qui il a cours ?</span> :`,
                callback: (input: string) => onProfs(input),
            };
        } else {
            return {
                input: hasLessonsText,
                textResult: `${MEMBER} Ok !
                `,
                nextPrefix: `${MEMBER} <span class='font-bold'>Formation poursuivie</span> (nom de ta formation) :`,
                callback: (input: string) => onStudies(input),
=======
                Lancement de la procédure d'ajout du <span class="font-bold">membre 1</span> à l'équipe.,
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Prénom</span> :`,
            callback: (input: string) => onFirstName(input, 0),
        };
    }

    function onFirstName(
        firstName: string,
        memberIndex: number
    ): CommandResult {
        teamParams.members[memberIndex] = {
            firstName: "",
            lastName: "",
            email: "",
            discord: null,
            phone: "",
            hasLessons: null,
            professors: "",
            studies: "",
            pmr: false,
        }
        teamParams.members[memberIndex].firstName = firstName;

        return {
            input: firstName,
            textResult: `${CREATE_TEAM} Ok !`,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Nom de famille</span> :`,
            callback: (input: string) => onLastName(input, memberIndex),
        };
    }

    function onLastName(lastName: string, memberIndex: number): CommandResult {
        teamParams.members[memberIndex].lastName = lastName;

        return {
            input: lastName,
            textResult: `${CREATE_TEAM} Ok !`,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Email</span> :`,
            callback: (input: string) => onEmail(input, memberIndex),
        };
    }

    function onEmail(email: string, memberIndex: number): CommandResult {
        teamParams.members[memberIndex].email = email;

        return {
            input: email,
            textResult: `${CREATE_TEAM} Ok !`,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Téléphone</span> :`,
            callback: (input: string) => onPhone(input, memberIndex),
        };
    }

    function onPhone(phone: string, memberIndex: number): CommandResult {
        teamParams.members[memberIndex].phone = phone;

        return {
            input: phone,
            textResult: `${CREATE_TEAM} Ok !`,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Pseudo discord</span> (Facultatif, laissez vide) :`,
            callback: (input: string) => onDiscord(input, memberIndex),
        };
    }

    function onDiscord(discord: string, memberIndex: number): CommandResult {
        teamParams.members[memberIndex].discord = discord;

        return {
            input: discord,
            textResult: `${CREATE_TEAM} Ok !`,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Ce membre a t'il des cours jeudi 7 décembre après 16h30 ou le matin du vendredi 8  ?</span> (oui/non) :`,
            callback: (input: string) => onHasLessons(input, memberIndex),
        };
    }

    function onHasLessons(
        hasLessonsText: string,
        memberIndex: number
    ): CommandResult {
        if (hasLessonsText != "oui" && hasLessonsText != "non") {
            return {
                input: hasLessonsText,
                textResult: `${CREATE_TEAM} Veuillez répondre par oui ou non`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Ce membre a t'il cours jeudi 7 décembre après 16h30 ou le matin du vendredi 8  ?</span> (oui/non) :`,
                callback: (input) => onHasLessons(input, memberIndex),
            };
        } else if (hasLessonsText === "oui") {
            teamParams.members[memberIndex].hasLessons = true
            return {
                input: hasLessonsText,
                textResult: `${CREATE_TEAM} Ok !`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Quels sont les noms professeurs avec qui il a cours ?</span> :`,
                callback: (input: string) => onProfs(input, memberIndex),
            };
        }
        else {
            return {
                input: hasLessonsText,
                textResult: `${CREATE_TEAM} Ok !`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Formation poursuivie</span> (nom de ta formation) :`,
                callback: (input: string) => onStudies(input, memberIndex),
            };
        }
    }

    function onProfs(professors: string, memberIndex: number): CommandResult {
        teamParams.members[memberIndex].professors = professors;

        return {
            input: professors,
            textResult: `${CREATE_TEAM} Ok !`,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Formation poursuivie</span> (nom de ta formation) :`,
            callback: (input: string) => onStudies(input, memberIndex),
        };
    }

    function onStudies(studies: string, memberIndex: number): CommandResult {
        teamParams.members[memberIndex].studies = studies;

        return {
            input: studies,
            textResult: `${CREATE_TEAM} Ok !`,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Situation de mobilités réduite ?</span> (oui/non) :`,
            callback: (input: string) => onPmr(input, memberIndex),
        };
    }

    function onPmr(pmrText: string, memberIndex: number): CommandResult {
        if (pmrText != "oui" && pmrText != "non") {
            return {
                input: pmrText,
                textResult: `${CREATE_TEAM} Veuillez répondre par oui ou non`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Situation de mobilités réduite ?</span> (oui/non) :`,
                callback: (input) => onPmr(input, memberIndex),
            };
        } else {
            const pmr = pmrText === "oui" ? true : false;

            teamParams.members[memberIndex].pmr = pmr;

            return {
                input: pmrText,
                textResult: `${CREATE_TEAM} Ok !
                    ${CREATE_TEAM} Ajout du membre terminée. Le processus est en cours...
                    ${CREATE_TEAM} Validé !`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Souhaites-tu ajouter un membre supplémentaire à ton équipe (oui/non) ?</span> (pas de limite de membre):`,
                callback: (input: string) =>
                    nextMemberOrEnd(input, memberIndex),
            };
        }
    }

    function nextMemberOrEnd(
        input: string,
        memberIndex: number
    ): CommandResult {
        if (input === "oui") {
            return {
                input,
                textResult: `${CREATE_TEAM} Ok ! Lancement de la procédure d'ajout d'un nouveau membre.
                ${CREATE_TEAM} ----- Ajout du <span class="font-bold">membre ${
                    memberIndex + 2
                }</span> à l'équipe -----`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Prénom</span> :`,
                callback: (input) => onFirstName(input, memberIndex + 1),
            };
        } else if (input === "non") {
            if (memberIndex === 0) {
                return {
                    input,
                    textResult: `${CREATE_TEAM} Attention, vous êtes seul·e dans votre équipe, ce qui n'est pas autorisé.
                    ${CREATE_TEAM} Vous pourrez ajouter des membres à votre équipe plus tard en utilisant la commande "edit-team"
                    ${CREATE_TEAM} Si vous souhaitez qu'on vous ajoute à une équipe de joueurs solo, tapez "oui", sinon tapez "non" et revenez éditer votre équipe plus tard.`,
                    nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Souhaitez-vous qu'on vous ajoute à une équipe de joueurs solo ?</span> (oui/non) :`,
                    callback: onSolo,
                };
            }

            return {
                input,
                textResult: `${CREATE_TEAM} Ok !`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Comment as-tu entendu parler de la nuit de l'info ?</span> :`,
                callback: onHowDidYouHear,
            };
        } else {
            return {
                input,
                textResult: `${CREATE_TEAM} Veuillez répondre par oui ou non`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Souhaites-tu ajouter un membre supplémentaire à ton équipe ?</span> (pas de limite de membre):`,
                callback: (input) => nextMemberOrEnd(input, memberIndex),
>>>>>>> Stashed changes
            };
        }
    }

<<<<<<< Updated upstream
    function onProfs(professors: string): CommandResult {
        member.teacher = [professors];

        return {
            input: professors,
            textResult: `${MEMBER} Ok !
            `,
            nextPrefix: `${MEMBER} <span class='font-bold'>Formation poursuivie</span> (nom de ta formation) :`,
            callback: (input: string) => onStudies(input),
        };
    }

    function onStudies(studies: string): CommandResult {
        member.study = studies;

        return {
            input: studies,
            textResult: `${MEMBER} Ok !
            `,
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
=======
    function onSolo(input: string) {
        if (input != "oui" && input != "non") {
            return {
                input,
                textResult: `${CREATE_TEAM} Veuillez répondre par oui ou non`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Souhaitez-vous qu'on vous ajoute à une équipe de joueurs solo ?</span> (oui/non) :`,
                callback: onSolo,
            };
        } else {
            teamParams.solo = input === "oui" ? true : false;

            return {
                input,
                textResult: `${CREATE_TEAM} Ok !`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Comment as-tu entendu parler de la nuit de l'info ?</span> :`,
                callback: onHowDidYouHear,
            };
        }
    }

    function onHowDidYouHear(howDidYouHear: string): CommandResult {
        teamParams.howDidYouHear = howDidYouHear;

        return {
            input: howDidYouHear,
            textResult: `${CREATE_TEAM} Ok !
            ${CREATE_TEAM} Félicitations, votre équipe a été créée avec succès !`,
            nextPrefix: null,
            callback: null,
        };
    }
>>>>>>> Stashed changes
}
