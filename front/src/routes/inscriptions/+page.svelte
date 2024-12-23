<script lang="ts">
    import { browser } from "$app/environment";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import SignUpMember from "../../lib/signUpMember.svelte";
    import loader from "../../assets/loader.svg";
    import more from "../../assets/more.svg";
    import * as Tabs from "$lib/components/ui/tabs";
    import * as Alert from "$lib/components/ui/alert";
    import { goto } from "$app/navigation";
    import { credentials } from "@/token";
    import type { Member } from "$lib/member";
    import { API_URL } from "@/utils";
    import { error } from "@sveltejs/kit";

    let teamName = "";
    $: teamName = teamName.replaceAll(" ", "-").toLowerCase();
    let comment = "";
    let members: Member[] = [
        {
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
            genre: "ne se prononce pas",
        },
    ];
    let errorText: string | null = null;
    let validationLoading = false;

    let leaderError = true;
    let memberErrors: boolean[] = [];
    $: validateEnabled = !leaderError && !memberErrors.some((e) => e);

    let submissionInfo: Promise<{
        max_participants_per_team: number;
        max_participants: number;
        current_participants: number;
    }> | null = browser
        ? fetch(`${API_URL}/api/submissionInformation`).then((resp) =>
              resp.json(),
          )
        : null;

    async function createTeam(teamName: string, teamPassword: string) {
        let data = JSON.stringify({
            teamName,
            teamHash: teamPassword,
        });
        return fetch(`${API_URL}/api/teams/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        });
    }

    async function addMember() {
        if (
            submissionInfo &&
            members.length >= (await submissionInfo).max_participants_per_team
        ) {
            return;
        }
        members.push({
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
            genre: "ne se prononce pas",
        });
        members = members;
        console.log(members);
    }
    function removeMember(index: number) {
        members.splice(index, 1);
        members = members;
    }

    function randomPassword() {
        return window.crypto
            .getRandomValues(new BigUint64Array(1))[0]
            .toString(36);
    }

    async function createUser(member: Member, password: string) {
        let data = JSON.stringify({
            ...member,
            teamName,
            teamPassword: password,
        });
        return fetch(`${API_URL}/api/users/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        });
    }

    async function signupSolo() {
        validationLoading = true;
        let data = JSON.stringify({
            ...members[0],
            teamName: "solo",
            teamPassword: "",
        });
        let resp = await fetch(`${API_URL}/api/users/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        });

        if (resp.status >= 400) {
            console.error("Error while signing up solo");
            errorText =
                "Erreur lors de l'inscription en solo : " + (await resp.text());
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            if (credentials) $credentials = { team: "solo", token: "" };
            goto("/inscriptions/merci-solo");
        }
        validationLoading = false;
    }

    async function signupTeam() {
        validationLoading = true;
        const password = randomPassword();

        let resps = [];

        resps.push(await createTeam(teamName, password));
        resps = resps.concat(
            await Promise.all(
                members.map((member) => {
                    return createUser(member, password);
                }),
            ),
        );

        if (credentials) $credentials = { team: teamName, token: password };

        let error = resps.find((resp) => resp.status >= 400);
        if (error) {
            console.error("Error while signing up solo");
            errorText =
                "Erreur lors de l'inscription en solo : " +
                (await error.text());
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            if (credentials) $credentials = { team: teamName, token: password };
            goto("/inscriptions/merci");
        }
        validationLoading = false;
    }
</script>

<div class="w-full h-full overflow-scroll p-[30px]">
    {#await submissionInfo}
        <div class="text-center w-full">
            <img src={loader} class="w-5 h-5 mr-[10px] animate-spin" alt="" />
            <p>Chargement...</p>
        </div>
    {:then info}
        {#if browser && info && info.current_participants >= info.max_participants}
            <Alert.Root variant="destructive">
                <Alert.Title>Plus de places disponibles !</Alert.Title>
                <Alert.Description>
                    Nous sommes désolé, mais nous ne pouvons pas accueillir plus
                    de {info.max_participants} participants et participantes.
                </Alert.Description>
            </Alert.Root>
        {:else if browser && info && info.current_participants + 10 > info.max_participants}
            <Alert.Root>
                <Alert.Title>Plus beaucoup de places disponibles !</Alert.Title>
                <Alert.Description>
                    Plus que {info.max_participants - info.current_participants}
                    places disponibles ! Si tu souhaites inscrire une équipe de plus
                    de {info.max_participants - info.current_participants} personnes,
                    contacte-nous à bdepalme@gmail.com ou au foyer du batiment 12D.
                </Alert.Description>
            </Alert.Root>
        {/if}

        <h1 class="text-4xl font-bold mb-[20px]">
            Inscris-toi à Hack Ta Fac !
        </h1>
        {#if errorText !== null}
            <Alert.Root variant="destructive" class="mb-[20px]">
                <Alert.Title>Un problème est survenu :'-(</Alert.Title>
                <Alert.Description>{errorText}</Alert.Description>
            </Alert.Root>
        {/if}
        <Tabs.Root>
            <Tabs.List class="grid w-full grid-cols-2">
                <Tabs.Trigger value="team">Équipe</Tabs.Trigger>
                <Tabs.Trigger value="solo">Solo</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="team">
                <Label for="nom">Nom d'équipe</Label>
                <Input type="text" id="text" bind:value={teamName} />
                {#if teamName.length > 0}
                    <p class="text-sm">
                        Affichage sur badge : {teamName
                            .split("-")
                            .map(
                                (w) => w.slice(0, 1).toUpperCase() + w.slice(1),
                            )
                            .join(" ")}
                    </p>
                {/if}

                <div class="my-[30px]">
                    <SignUpMember
                        title="Chef d'équipe"
                        member={members[0]}
                        trashable={false}
                        bind:error={leaderError}
                    ></SignUpMember>
                </div>

                {#each members.slice(1) as member, index}
                    <div class="mb-[30px]">
                        <SignUpMember
                            title={"Membre" + (index + 1)}
                            {member}
                            trashable={true}
                            on:trashed={() => removeMember(index + 1)}
                            bind:error={memberErrors[index]}
                        ></SignUpMember>
                    </div>
                {/each}

                <Button
                    variant="outline"
                    class="mb-[20px] flex items-center justify-between px-[10px]"
                    disabled={browser &&
                        info &&
                        members.length >= info.max_participants_per_team}
                    on:click={addMember}
                >
                    <img src={more} alt="" class="w-[15px] h-[15px]" />
                    <p class="ml-[10px]">Ajouter un membre</p>
                </Button>
                <br />

                <Label for="comment">
                    Comment avez-vous entendu parler de Hack ta Fac ?
                </Label>
                <Input type="text" id="comment" bind:value={comment} />
                <Button
                    variant="outline"
                    class="w-full mt-[5px]"
                    disabled={validationLoading || !validateEnabled}
                    on:click={signupTeam}
                >
                    {#if validationLoading}
                        <img
                            src={loader}
                            alt="loader"
                            class="w-5 h-5 mr-[10px] animate-spin"
                        />
                    {/if}
                    Inscrire mon équipe !
                </Button>
                {#if !validateEnabled}
                    <p class="text-xs text-center text-red-500">
                        Veuillez remplir tous les champs obligatoires
                    </p>
                {/if}
            </Tabs.Content>
            <Tabs.Content value="solo">
                <Alert.Root>
                    <Alert.Title>Inscription Solo</Alert.Title>
                    <Alert.Description>
                        Si tu t'inscris en solo, tu seras ajouté à une équipe de
                        participants et participantes qui se sont aussi inscrits
                        en solo !
                    </Alert.Description>
                </Alert.Root>

                <div class="my-[30px]">
                    <SignUpMember
                        title={"Tes coordonnées"}
                        member={members[0]}
                        trashable={false}
                        bind:error={leaderError}
                    ></SignUpMember>
                </div>

                <Label for="comment">
                    Comment as-tu entendu parler de Hack Ta Fac ?
                </Label>
                <Input
                    type="text"
                    id="comment"
                    bind:value={comment}
                    class="mb-[30px]"
                />

                <Button
                    variant="outline"
                    class="w-full mt-[5px]"
                    disabled={validationLoading || !validateEnabled}
                    on:click={signupSolo}
                >
                    {#if validationLoading}
                        <img
                            src={loader}
                            alt="loader"
                            class="w-5 h-5 mr-[10px] animate-spin"
                        />
                    {/if}
                    Inscrire mon équipe !
                </Button>
                {#if !validateEnabled}
                    <p class="text-sm text-red-500">
                        Veuillez remplir tous les champs obligatoires
                    </p>
                {/if}
            </Tabs.Content>
        </Tabs.Root>
    {/await}
</div>
