<script lang="ts">
    import { credentials } from "@/token";
    import * as Accordion from "$lib/components/ui/accordion";
    import trash from "../../assets/trash.svg";
    import loader from "../../assets/loader.svg";
    import { goto } from "$app/navigation";
    import { dev, browser } from "$app/environment";
    import type { Member } from "$lib/member";
    import { Button } from "$lib/components/ui/button";
    import SignUpMember from "@/signUpMember.svelte";
    import more from "../../assets/more.svg";
    import { toast } from "svelte-sonner";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import * as Alert from "$lib/components/ui/alert";
    import { onMount } from "svelte";
    import { API_URL } from "@/utils";

    let newMember: Member = {
        first_name: "",
        name: "",
        email: "",
        phone: "",
        study: "",
        pmr: false,
        nickname: "",
        teacher: "",
        course: false,
        comment: "",
        genre: "femme",
    };

    let newMemberError: boolean = false;

    let accordionTabOpen: string | string[] | undefined = undefined;

    let team:
        | {
              name: string;
              members: Member[];
          }
        | "loading" = "loading";

    let submissionInfo:
        | {
              max_participants_per_team: number;
              max_participants: number;
              current_participants: number;
          }
        | "loading" = "loading";

    onMount(async () => {
        if (browser) {
            if (!$credentials || !$credentials?.team || !$credentials?.token) {
                goto("/se-connecter/");
                toast.error("Tu n'es pas connecté !");
                return;
            }

            team = await fetch(
                `${API_URL}/api/teams/${$credentials?.team}/${$credentials?.token}`,
            )
                .then((resp) => resp.json())
                .catch((err) => {
                    console.error(err);
                    toast.error("Erreur lors de la récupération de l'équipe");
                });

            submissionInfo = await fetch(`${API_URL}/api/submissionInformation`)
                .then((resp) => resp.json())
                .catch((err) => {
                    console.error(err);
                    toast.error(
                        "Erreur lors de la récupération des informations de soumission d'inscription",
                    );
                });
        }
    });

    async function removeMember(index: number) {
        if (team == "loading") return;

        fetch(
            `${API_URL}/api/teams/${$credentials?.team}/${$credentials?.token}/remove/${team.members[index].email}`,
            { method: "DELETE" },
        ).then(async (resp) => {
            if (team == "loading") return;

            if (resp.status == 200) {
                team.members.splice(index, 1);
                team.members = team.members;
                toast.success("Membre supprimé !");
            } else {
                toast.error(
                    "Erreur lors de la suppression : " + (await resp.text()),
                );
            }
        });
    }
    function addMember() {
        fetch(`${API_URL}/api/users/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...newMember,
                teamName: $credentials?.team,
                teamPassword: $credentials?.token,
            }),
        }).then(async (resp) => {
            if (team == "loading") return;
            if (resp.status >= 200 && resp.status < 300) {
                team.members.push(newMember);
                team.members = team.members;
                toast.success("Membre ajouté !");
                console.log(accordionTabOpen);
                newMember = {
                    first_name: "",
                    name: "",
                    email: "",
                    phone: "",
                    study: "",
                    pmr: false,
                    nickname: "",
                    teacher: "",
                    course: false,
                    comment: "",
                    genre: "femme",
                };
            } else {
                toast.error("Erreur lors de l'ajout : " + (await resp.text()));
            }
        });
    }

    function disconnect() {
        localStorage.removeItem("credentials");
        $credentials = null;
        goto("/se-connecter/");
    }
</script>

<main
    class="w-[100vw] h-[100vh] overflow-scroll flex flex-col space-y-10 items-center justify-center"
>
    {#if team == "loading"}
        <div class="flex items-center space-x-2">
            <img src={loader} alt="" class="animate-spin w-5 h-5" />
            <p>Chargement</p>
        </div>
    {:else}
        <h1 class="text-3xl">
            {$credentials?.team
                .split("-")
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(" ")}
        </h1>
        <Accordion.Root
            class="w-[100vw] sm:w-[75vh]"
            bind:value={accordionTabOpen}
        >
            {#each team.members as member, index}
                <Accordion.Item value={"member-" + index}>
                    <Accordion.Trigger>
                        <div class="flex items-center">
                            <AlertDialog.Root>
                                <AlertDialog.Trigger
                                    on:click={(e) => e.stopPropagation()}
                                >
                                    <Button
                                        class=""
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <img
                                            src={trash}
                                            alt="retirer"
                                            class="w-[20px] h-[20px]"
                                        />
                                    </Button>
                                </AlertDialog.Trigger>
                                <AlertDialog.Content>
                                    <AlertDialog.Header>
                                        <AlertDialog.Title
                                            >Es-tu sûr de vouloir supprimer ce
                                            membre ?</AlertDialog.Title
                                        >
                                        <AlertDialog.Description>
                                            Si tu es sûr, clique sur "Continue"
                                            pour supprimer le membre. Sinon
                                            clique sur "Annuler".
                                        </AlertDialog.Description>
                                    </AlertDialog.Header>
                                    <AlertDialog.Footer>
                                        <AlertDialog.Cancel>
                                            Annuler
                                        </AlertDialog.Cancel>
                                        <AlertDialog.Action
                                            on:click={() => removeMember(index)}
                                        >
                                            Continue
                                        </AlertDialog.Action>
                                    </AlertDialog.Footer>
                                </AlertDialog.Content>
                            </AlertDialog.Root>
                            <p>{member.first_name + " " + member.name}</p>
                        </div>
                    </Accordion.Trigger>
                    <Accordion.Content transitionConfig={{ duration: 400 }}>
                        <p>
                            <span class="font-bold">Nom : </span>{member.name}
                        </p>
                        <p>
                            <span class="font-bold">Prénom :</span>
                            {member.first_name}
                        </p>
                        <p>
                            <span class="font-bold">Email :</span>
                            {member.email}
                        </p>
                        <p>
                            <span class="font-bold">Téléphone :</span>
                            {member.phone}
                        </p>
                        <p>
                            <span class="font-bold">Études :</span>
                            {member.study}
                        </p>
                        <p>
                            <span class="font-bold">Mobilité réduite:</span>
                            {member.pmr ? "oui" : "non"}
                        </p>
                        <p>
                            <span class="font-bold">Discord :</span>
                            {member.nickname}
                        </p>
                    </Accordion.Content>
                </Accordion.Item>
            {/each}
            <Accordion.Item value="add">
                <Accordion.Trigger>
                    <div class="flex items-center space-x-2">
                        <img src={more} alt="" />
                        <p>Ajouter un membre</p>
                    </div>
                </Accordion.Trigger>
                <Accordion.Content class="flex justify-center">
                    <div class="flex flex-col space-y-2 justify-center">
                        {#if submissionInfo != "loading"}
                            {#if submissionInfo.current_participants >= submissionInfo.max_participants}
                                <Alert.Root variant="destructive">
                                    <Alert.Title class="text-lg">
                                        Plus de places disponibles !
                                    </Alert.Title>
                                    <Alert.Description class="text-justify">
                                        Il n'y a plus de places disponibles pour
                                        les inscriptions. Tu peux essayer
                                        d'attendre, ou de nous contacter en
                                        passant par l'adresse mail
                                        bdepalme@gmail.com ou au foyer du
                                        batiment 12D.
                                    </Alert.Description>
                                </Alert.Root>
                            {:else if submissionInfo.current_participants + 10 > submissionInfo.max_participants}
                                <Alert.Root>
                                    <Alert.Title class="text-lg">
                                        Très peu de places restantes !
                                    </Alert.Title>
                                    <Alert.Description class="text-justify">
                                        Il ne reste que
                                        <span class="font-bold">
                                            {submissionInfo.max_participants -
                                                submissionInfo.current_participants}
                                            places
                                        </span>
                                        pour les inscriptions. Si tu veux ajouter
                                        plus de {submissionInfo.max_participants -
                                            submissionInfo.current_participants}
                                        membres, contacte-nous à l'adresse mail bdepalme@gmail.com
                                        ou en passant au foyer du batiment 12D.
                                    </Alert.Description>
                                </Alert.Root>
                            {/if}

                            <SignUpMember
                                member={newMember}
                                title="Nouveau membre"
                                trashable={false}
                                bind:error={newMemberError}
                            />
                            <Button
                                on:click={addMember}
                                disabled={submissionInfo.current_participants >=
                                    submissionInfo.max_participants ||
                                    newMemberError}
                            >
                                Valider
                            </Button>
                            {#if newMemberError}
                                <p class="text-xs text-red-500">
                                    Il y a une erreur dans le formulaire.
                                    Vérifie les champs en rouge.
                                </p>
                            {/if}
                        {:else}
                            <div class="flex items-center space-x-2">
                                <img
                                    src={loader}
                                    alt=""
                                    class="animate-spin w-5 h-5"
                                />
                                <p>Chargement</p>
                            </div>
                        {/if}
                    </div>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    {/if}
    <Button on:click={disconnect}>Déconnexion</Button>
</main>
