import { dev } from "$app/environment";

export type CommandResult = {
    input: string;
    textResult: string;
    nextPrefix: string | null;
    callback:
        | ((input: string) => Promise<CommandResult> | CommandResult)
        | null;
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

const CREATE_TEAM =
    "[<span class='text-indigo-400 font-bold'>CREATE-TEAM</span>]";
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
                hasLessons: boolean;
                professors: string[];
                studies: string;
                pmr: boolean;
            }
        ];
        howDidYouHear: string;
        solo: boolean;
    } = {
        teamName: "",
        members: [
            {
                firstName: "",
                lastName: "",
                email: "",
                discord: null,
                phone: "",
                hasLessons: false,
                professors: [""],
                studies: "",
                pmr: false,
            },
        ],
        howDidYouHear: "",
        solo: false,
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
            input: "<span class='text-red-400'>" + teamName + "</span>",
            textResult: `${CREATE_TEAM} Ok !

                --- Lancement de la procédure d'ajout du <span class="font-bold">membre 1</span> à l'équipe. ---
            
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
            hasLessons: false,
            professors: [],
            studies: "",
            pmr: false,
        };
        teamParams.members[memberIndex].firstName = firstName;

        return {
            input: "<span class='text-red-400'>" + firstName + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Nom de famille</span> :`,
            callback: (input: string) => onLastName(input, memberIndex),
        };
    }

    function onLastName(lastName: string, memberIndex: number): CommandResult {
        teamParams.members[memberIndex].lastName = lastName;

        return {
            input: "<span class='text-red-400'>" + lastName + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Email</span> :`,
            callback: (input: string) => onEmail(input, memberIndex),
        };
    }

    function onEmail(email: string, memberIndex: number): CommandResult {
        //Regex to check if email is valid
        const regex = /\S+@\S+\.\S+/;
        console.log(email, regex.test(email));
        if (!regex.test(email)) {
            return {
                input: "<span class='text-red-400'>" + email + "</span>",
                textResult: `${CREATE_TEAM} Veuillez entrer une adresse email valide`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Email</span> :`,
                callback: (input: string) => onEmail(input, memberIndex),
            };
        }
        

        teamParams.members[memberIndex].email = email;

        return {
            input: "<span class='text-red-400'>" + email + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Téléphone</span> :`,
            callback: (input: string) => onPhone(input, memberIndex),
        };
    }

    function onPhone(phone: string, memberIndex: number): CommandResult {
        const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!regex.test(phone)) {
            return {
                input: "<span class='text-red-400'>" + phone + "</span>",
                textResult: `${CREATE_TEAM} Veuillez entrer un numéro de téléphone valide (séparateur : aucun, espace, point ou tiret))`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Téléphone</span> :`,
                callback: (input: string) => onPhone(input, memberIndex),
            };
        }

        teamParams.members[memberIndex].phone = phone;

        return {
            input: "<span class='text-red-400'>" + phone + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Pseudo discord</span> (Facultatif, laissez vide) :`,
            callback: (input: string) => onDiscord(input, memberIndex),
        };
    }

    function onDiscord(discord: string, memberIndex: number): CommandResult {
        teamParams.members[memberIndex].discord =
            discord.length > 0 ? discord : null;

        return {
            input: "<span class='text-red-400'>" + discord + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
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
                input:
                    "<span class='text-red-400'>" + hasLessonsText + "</span>",
                textResult: `${CREATE_TEAM} Veuillez répondre par oui ou non`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Ce membre a t'il cours jeudi 7 décembre après 16h30 ou le matin du vendredi 8  ?</span> (oui/non) :`,
                callback: (input) => onHasLessons(input, memberIndex),
            };
        } else if (hasLessonsText === "oui") {
            teamParams.members[memberIndex].hasLessons = true;
            return {
                input:
                    "<span class='text-red-400'>" + hasLessonsText + "</span>",
                textResult: `${CREATE_TEAM} Ok !
                `,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Quels sont les noms professeurs avec qui il a cours ?</span> :`,
                callback: (input: string) => onProfs(input, memberIndex),
            };
        } else {
            return {
                input:
                    "<span class='text-red-400'>" + hasLessonsText + "</span>",
                textResult: `${CREATE_TEAM} Ok !
                `,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Formation poursuivie</span> (nom de ta formation) :`,
                callback: (input: string) => onStudies(input, memberIndex),
            };
        }
    }

    function onProfs(professors: string, memberIndex: number): CommandResult {
        teamParams.members[memberIndex].professors = [professors];

        return {
            input: "<span class='text-red-400'>" + professors + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Formation poursuivie</span> (nom de ta formation) :`,
            callback: (input: string) => onStudies(input, memberIndex),
        };
    }

    function onStudies(studies: string, memberIndex: number): CommandResult {
        teamParams.members[memberIndex].studies = studies;

        return {
            input: "<span class='text-red-400'>" + studies + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Situation de mobilités réduite ?</span> (oui/non) :`,
            callback: (input: string) => onPmr(input, memberIndex),
        };
    }

    function onPmr(pmrText: string, memberIndex: number): CommandResult {
        if (pmrText != "oui" && pmrText != "non") {
            return {
                input: "<span class='text-red-400'>" + pmrText + "</span>",
                textResult: `${CREATE_TEAM} Veuillez répondre par oui ou non`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Situation de mobilités réduite ?</span> (oui/non) :`,
                callback: (input) => onPmr(input, memberIndex),
            };
        } else {
            const pmr = pmrText === "oui" ? true : false;

            teamParams.members[memberIndex].pmr = pmr;

            return {
                input: "<span class='text-red-400'>" + pmrText + "</span>",
                textResult: `${CREATE_TEAM} Ok !
                    ${CREATE_TEAM} Ajout du membre terminée. Le processus est en cours...
                    ${CREATE_TEAM} Validé !
                    `,
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
                input: "<span class='text-red-400'>" + input + "</span>",
                textResult: `${CREATE_TEAM} Ok ! Lancement de la procédure d'ajout d'un nouveau membre.
                ${CREATE_TEAM} ----- Ajout du <span class="font-bold">membre ${
                    memberIndex + 2
                }</span> à l'équipe -----`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Prénom</span> :`,
                callback: (input) => onFirstName(input, memberIndex + 1),
            };
        } else if (input === "non") {
            return {
                input: "<span class='text-red-400'>" + input + "</span>",
                textResult: `${CREATE_TEAM} Ok !
                `,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Comment as-tu entendu parler de la nuit de l'info ?</span> :`,
                callback: onHowDidYouHear,
            };
        } else {
            return {
                input: "<span class='text-red-400'>" + input + "</span>",
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

        if(resp.status >= 400) {
            return {
                input: "<span class='text-red-400'>" + howDidYouHear + "</span>",
                textResult: `[<span class="text-red-400 font-bold">ERREUR</span>] ${respText}`,
                nextPrefix: null,
                callback: null,
            }
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
                        name: member.lastName,
                        first_name: member.firstName,
                        pmr: member.pmr,
                        course: member.hasLessons,
                        teacher: member.professors,
                        email: member.email,
                        timestamp: Date.now().toString(),
                        nickname: "",
                        phone: member.phone,
                        study: member.studies,
                        comment: "",
                    }),
                })
            );
        }

        await Promise.all(proms);

        return {
            input: "<span class='text-red-400'>" + howDidYouHear + "</span>",
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
    let soloPlayer: {
        firstName: string;
        lastName: string;
        email: string;
        discord: string | null;
        phone: string;
        hasLessons: boolean;
        professors: string[];
        studies: string;
        pmr: boolean;
    } = {
        firstName: "",
        lastName: "",
        email: "",
        discord: null,
        phone: "",
        hasLessons: false,
        professors: [""],
        studies: "",
        pmr: false,
    };

    return {
        input: command,
        textResult: `${CREATE_TEAM} --- Lancement de la procédure d'inscription. ---
        `,
        nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Prénom</span> :`,
        callback: onFirstName,
    };

    function onFirstName(
        firstName: string,
    ): CommandResult {
        soloPlayer = {
            firstName: "",
            lastName: "",
            email: "",
            discord: null,
            phone: "",
            hasLessons: false,
            professors: [],
            studies: "",
            pmr: false,
        };
        soloPlayer.firstName = firstName;

        return {
            input: "<span class='text-red-400'>" + firstName + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Nom de famille</span> :`,
            callback: (input: string) => onLastName(input),
        };
    }

    function onLastName(lastName: string): CommandResult {
        soloPlayer.lastName = lastName;

        return {
            input: "<span class='text-red-400'>" + lastName + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Email</span> :`,
            callback: (input: string) => onEmail(input),
        };
    }

    function onEmail(email: string): CommandResult {
        //Regex to check if email is valid
        const regex = /\S+@\S+\.\S+/;
        if (!regex.test(email)) {
            return {
                input: "<span class='text-red-400'>" + email + "</span>",
                textResult: `${CREATE_TEAM} Veuillez entrer une adresse email valide`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Email</span> :`,
                callback: (input: string) => onEmail(input),
            };
        }

        soloPlayer.email = email;

        return {
            input: "<span class='text-red-400'>" + email + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Téléphone</span> :`,
            callback: (input: string) => onPhone(input),
        };
    }

    function onPhone(phone: string): CommandResult {
        const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!regex.test(phone)) {
            return {
                input: "<span class='text-red-400'>" + phone + "</span>",
                textResult: `${CREATE_TEAM} Veuillez entrer un numéro de téléphone valide (séparateur : aucun, espace, point ou tiret))`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Téléphone</span> :`,
                callback: (input: string) => onPhone(input),
            };
        }

        soloPlayer.phone = phone;

        return {
            input: "<span class='text-red-400'>" + phone + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Pseudo discord</span> (Facultatif, laissez vide) :`,
            callback: (input: string) => onDiscord(input),
        };
    }

    function onDiscord(discord: string): CommandResult {
        soloPlayer.discord = discord.length > 0 ? discord : null;

        return {
            input: "<span class='text-red-400'>" + discord + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Ce membre a t'il des cours jeudi 7 décembre après 16h30 ou le matin du vendredi 8  ?</span> (oui/non) :`,
            callback: (input: string) => onHasLessons(input),
        };
    }

    function onHasLessons(hasLessonsText: string): CommandResult {
        if (hasLessonsText != "oui" && hasLessonsText != "non") {
            return {
                input:
                    "<span class='text-red-400'>" + hasLessonsText + "</span>",
                textResult: `${CREATE_TEAM} Veuillez répondre par oui ou non`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Ce membre a t'il cours jeudi 7 décembre après 16h30 ou le matin du vendredi 8  ?</span> (oui/non) :`,
                callback: (input) => onHasLessons(input),
            };
        } else if (hasLessonsText === "oui") {
            soloPlayer.hasLessons = true;
            return {
                input:
                    "<span class='text-red-400'>" + hasLessonsText + "</span>",
                textResult: `${CREATE_TEAM} Ok !
                `,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Quels sont les noms professeurs avec qui il a cours ?</span> :`,
                callback: (input: string) => onProfs(input),
            };
        } else {
            return {
                input:
                    "<span class='text-red-400'>" + hasLessonsText + "</span>",
                textResult: `${CREATE_TEAM} Ok !
                `,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Formation poursuivie</span> (nom de ta formation) :`,
                callback: (input: string) => onStudies(input),
            };
        }
    }

    function onProfs(professors: string): CommandResult {
        soloPlayer.professors = [professors];

        return {
            input: "<span class='text-red-400'>" + professors + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Formation poursuivie</span> (nom de ta formation) :`,
            callback: (input: string) => onStudies(input),
        };
    }

    function onStudies(studies: string): CommandResult {
        soloPlayer.studies = studies;

        return {
            input: "<span class='text-red-400'>" + studies + "</span>",
            textResult: `${CREATE_TEAM} Ok !
            `,
            nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Situation de mobilités réduite ?</span> (oui/non) :`,
            callback: (input: string) => onPmr(input),
        };
    }

    function onPmr(pmrText: string): CommandResult {
        if (pmrText != "oui" && pmrText != "non") {
            return {
                input: "<span class='text-red-400'>" + pmrText + "</span>",
                textResult: `${CREATE_TEAM} Veuillez répondre par oui ou non`,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Situation de mobilités réduite ?</span> (oui/non) :`,
                callback: (input) => onPmr(input),
            };
        } else {
            const pmr = pmrText === "oui" ? true : false;

            soloPlayer.pmr = pmr;

            return {
                input: "<span class='text-red-400'>" + pmrText + "</span>",
                textResult: `${CREATE_TEAM} Ok !
                    ${CREATE_TEAM} Ajout du membre terminée. Le processus est en cours...
                    ${CREATE_TEAM} Validé !
                    `,
                nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Comment avez-vous entendu parler de la nuit de l'info à l'ISTIC ?</span>`,
                callback: (input: string) => onHowDidYouHear(input),
            };
        }
    }

    async function onHowDidYouHear(
        howDidYouHear: string
    ): Promise<CommandResult> {
        // soloPlayer.howDidYouHear = howDidYouHear;

        const hostname = window.location.hostname;
        const port = 8000;

        let proms = [];
        let joinSoloURL = `http://${hostname}:${port}/joinSolo`;

        if (dev) {
            joinSoloURL = `http://localhost:8000/joinSolo`;
        }

        let resp = await fetch(joinSoloURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: soloPlayer.lastName,
                first_name: soloPlayer.firstName,
                pmr: soloPlayer.pmr,
                course: soloPlayer.hasLessons,
                teacher: soloPlayer.professors,
                email: soloPlayer.email,
                timestamp: Date.now().toString(),
                nickname: "",
                phone: soloPlayer.phone,
                study: soloPlayer.studies,
                comment: "",
            }),
        })


        if (resp.status >= 400) {
            return {
                input: "<span class='text-red-400'>" + howDidYouHear + "</span>",
                textResult: `[<span class="text-red-400 font-bold">ERREUR</span>] ${await resp.text()}`,
                nextPrefix: null,
                callback: null,
            }
        }

        return {
            input: "<span class='text-red-400'>" + howDidYouHear + "</span>",
            textResult: `${CREATE_TEAM} Ok !

            ${CREATE_TEAM} Félicitations, vous êtes inscrit·e avec succès !
            ${CREATE_TEAM} Vous serez ajouté·e à une équipe de participant·es solo.
            `,
            nextPrefix: null,
            callback: null,
        };
    }
}
