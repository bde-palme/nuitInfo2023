import { dev } from "$app/environment";

export type CommandResult = {
    input: string;
    textResult: string;
    nextPrefix: string | null;
    callback: ((input: string) => Promise<CommandResult> | CommandResult) | null;
};

export function processCommand(command: string): CommandResult {
    if (command === "start") {
        return {
            input: command,
            textResult: `Bienvenue dans le terminal d'inscription à la nuit de l'info !
        Souhaitez-vous créer une nouvelle équipe ou modifier une équipe existante ?
        - Pour créer une nouvelle équipe, tapez "create-team"
        - Pour modifier une équipe existante, tapez "edit-team" 
        `,
            nextPrefix: null,
            callback: null,
        };
    } else if (command === "create-team") {
        return createTeam(command);
    } else if (command === "edit-team") {
    }

    return {
        input: command,
        textResult: "Commande inconnue : utiliser start pour commencer",
        nextPrefix: null,
        callback: null,
    };
}

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
    } = {
        teamName: "",
        members: [
            {
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
        nextPrefix: `${CREATE_TEAM} <span class='font-bold'>Nom d'équipe</span> :`,
        callback: onTeamName,
    };

    function onTeamName(teamName: string) {
        teamParams.teamName = teamName;

        return {
            input: teamName,
            textResult: `${CREATE_TEAM} Ok !
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
            };
        }
    }

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

    async function onHowDidYouHear(howDidYouHear: string): Promise<CommandResult> {
        teamParams.howDidYouHear = howDidYouHear;

        const hostname = window.location.hostname;
        const port = 8000;
        let createTeamURL = `http://${hostname}:${port}/createTeam/${teamParams.teamName}`;

        if (dev) {
            createTeamURL = `http://localhost:8000/createTeam/${teamParams.teamName}`;
        }

        let resp = await fetch(createTeamURL);
        let password = await resp.text();
        
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
                    mode: "no-cors",
                    body: JSON.stringify({
                        name: member.lastName,
                        first_name: member.firstName,
                        pmr: member.pmr,
                        course: member.hasLessons,
                        teacher: member.professors,
                        email: member.email,
                        nickname: "",
                        phone: member.phone,
                        study: member.studies,
                        comment: "",
                    }),
                })
            );
        }

        await Promise.all(proms)

        return {
            input: howDidYouHear,
            textResult: `${CREATE_TEAM} Ok !
            ${CREATE_TEAM} Félicitations, votre équipe a été créée avec succès !
            ${CREATE_TEAM} (!) Mot de passe d'équipe : <span class="font-bold">${password}</span>
            ${CREATE_TEAM} Ce mot de passe doit être conservé précieusement, il pourra vous servir à modifier votre équipe (ajouter ou supprimer des membres).
            ${CREATE_TEAM} Votre inscription est terminée. Pour modifier votre équipe, tapez "edit-team".`,
            nextPrefix: null,
            callback: null,
        };
    }
}
