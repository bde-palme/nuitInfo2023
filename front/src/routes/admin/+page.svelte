<script lang="ts">
    import { credentials } from "@/token";
    import * as Card from "$lib/components/ui/card";
    import * as Tabs from "$lib/components/ui/tabs";
    import usersSVG from "@assets/users.svg";
    import * as Table from "$lib/components/ui/table";
    import Button from "$lib/components/ui/button/button.svelte";
    import trash from "@assets/trash.svg";
    import addUserSVG from "@assets/addUser.svg";
    import type { Member } from "@/member";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { dev } from "$app/environment";
    import { toast } from "svelte-sonner";
    import * as Dialog from "$lib/components/ui/dialog";
    import SignUpMember from "@/signUpMember.svelte";
    import more from "@assets/more.svg";
    import Input from "$lib/components/ui/input/input.svelte";
    import { API_URL } from "@/utils";

    let adminToken = $credentials?.token;

    let users: Member[] | "loading" = "loading";
    let sortKey = "timestamp";
    let teams: { name: string; members: Member[] }[] | "loading" = "loading";
    let addUserDialogOpen = false;
    let addUserDialogTeamName = "";
    let addUserDialogMember: Member = {
        team: "",
        first_name: "",
        name: "",
        email: "",
        phone: "",
        study: "",
        pmr: false,
        genre: "ne se prononce pas",
        teacher: "",
        nickname: "",
        comment: "",
        course: false,
    };

    let addTeamDialogOpen = false;
    let addTeamDialogName = "";
    let addTeamDialogHash: string | null = null;

    onMount(async () => {
        if (!$credentials || !$credentials?.team || !$credentials?.token) {
            goto("/se-connecter/");
            return;
        }

        teams = await fetch(`${API_URL}/api/teams?token=${adminToken}`).then(
            (res) => res.json(),
        );

        if (teams === "loading") return;

        teams.sort((a, b) => {
            if (
                (a.members[0]?.timestamp || 0) < (b.members[0]?.timestamp || 0)
            ) {
                return 1;
            }
            if (
                (a.members[0]?.timestamp || 0) > (b.members[0]?.timestamp || 0)
            ) {
                return -1;
            }
            return 0;
        });

        users = teams
            .map((team: { name: string; members: Member[] }) => team.members)
            .reduce((acc, val) => acc.concat(val), []);
        console.log(users);

        sortBy(sortKey);
    });

    function sortBy(prop: string) {
        if (users === "loading") return;

        console.log("sorting by", prop);

        users.sort((a, b) => {
            if (a[prop] < b[prop]) {
                return -1;
            }
            if (a[prop] > b[prop]) {
                return 1;
            }
            return 0;
        });

        if (sortKey === prop) {
            console.log("reversing");
            users = users.reverse();
            sortKey = prop + "r";
            return;
        } else sortKey = prop;

        users = users;
    }

    function openAddUserDialog(team: string) {
        addUserDialogOpen = true;
        addUserDialogTeamName = team;
    }

    async function addUser() {
        if (users == "loading") return;
        let resp = await fetch(`${API_URL}/api/users/create-admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...addUserDialogMember,
                teamName: addUserDialogTeamName,
                token: adminToken,
            }),
        });
        if (resp.status >= 200 && resp.status <= 300) {
            toast.success("Membre ajouté !");
            addUserDialogOpen = false;
            users.push({
                ...addUserDialogMember,
                timestamp: Date.now(),
                team: addUserDialogTeamName,
            });
            users = users;
        } else {
            toast.error("Erreur lors de l'ajout : " + (await resp.text()));
        }
    }

    async function removeUser(email: string) {
        if (users == "loading") return;
        let resp = await fetch(
            `${API_URL}/api/users/${email}/remove?token=${adminToken}`,
        );
        if (resp.status >= 200 && resp.status <= 300) {
            toast.success("Membre supprimé !");
            users = users.filter((u) => u.email !== email);
        } else {
            toast.error(
                "Erreur lors de la suppression : " + (await resp.text()),
            );
        }
    }

    async function removeTeam(team: string) {
        if (teams == "loading") return;
        let resp = await fetch(
            `${API_URL}/api/teams/${team}/remove?token=${adminToken}`,
        );
        if (resp.status >= 200 && resp.status <= 300) {
            toast.success("Equipe supprimé !");
            teams = teams.filter((t) => t.name !== team);
        } else {
            toast.error(
                "Erreur lors de la suppression : " + (await resp.text()),
            );
            teams = teams;
        }
    }

    function openAddTeamDialog() {
        addTeamDialogOpen = true;
    }

    async function addTeam() {
        if (teams == "loading") return;
        addTeamDialogHash = window.crypto
            .getRandomValues(new BigUint64Array(1))[0]
            .toString(36);
        let resp = await fetch(`${API_URL}/api/teams/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                teamName: addTeamDialogName,
                teamHash: addTeamDialogHash,
            }),
        });

        if (resp.status >= 200 && resp.status <= 300) {
            toast.success("Equipe ajoutée !");
            teams.push({
                name: addTeamDialogName,
                members: [],
            });
            teams = teams;
        } else {
            toast.error("Erreur lors de l'ajout : " + (await resp.text()));
        }
    }
</script>

<Dialog.Root bind:open={addUserDialogOpen}>
    <Dialog.Trigger />
    <Dialog.Content class="h-[90vh] overflow-scroll">
        <Dialog.Header>
            <Dialog.Title
                >Ajouter un utilisateur {addUserDialogTeamName}</Dialog.Title
            >
        </Dialog.Header>
        <SignUpMember
            member={addUserDialogMember}
            title="Ajout d'un membre"
            trashable={false}
        />

        <Button on:click={() => addUser()}>Ajouter</Button>
    </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={addTeamDialogOpen}>
    <Dialog.Trigger />
    <Dialog.Content>
        {#if !addTeamDialogHash}
            <Dialog.Header>
                <Dialog.Title>Ajouter un utilisateur</Dialog.Title>
            </Dialog.Header>
            <Input placeholder="Nom d'équipe" bind:value={addTeamDialogName} />
            <Button on:click={() => addTeam()}>Ajouter</Button>
        {:else}
            <p>Mot de passe d'équipe : {addTeamDialogHash}</p>
            <Button
                on:click={() => {
                    addTeamDialogOpen = false;
                    addTeamDialogHash = null;
                }}
            >
                Ok !
            </Button>
        {/if}
    </Dialog.Content>
</Dialog.Root>

<div class="p-4 flex flex-col space-y-4">
    <div class="grid grid-cols-4 gap-4">
        <Card.Root>
            <Card.Header
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <Card.Title class="text-sm font-medium">Individus</Card.Title>
                <img src={usersSVG} alt="" class="h-4 w-4" />
            </Card.Header>
            <Card.Content>
                <p class="text-xl font-bold">
                    {users.length} inscrits & inscrites
                </p>
                <p class="text-xs">
                    +{users != "loading" &&
                        (
                            (users.filter(
                                (u) =>
                                    new Date(u.timestamp) >
                                    new Date(
                                        Date.now() - 60 * 60 * 24 * 7 * 1000,
                                    ),
                            ).length /
                                users.filter(
                                    (u) =>
                                        new Date(u.timestamp) <
                                        new Date(
                                            Date.now() -
                                                60 * 60 * 24 * 7 * 1000,
                                        ),
                                ).length) *
                            100
                        )
                            .toString()
                            .slice(0, 4)}% en une semaine
                </p>
            </Card.Content>
        </Card.Root>
        <Card.Root>
            <Card.Header
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <Card.Title class="text-sm font-medium">Équipes</Card.Title>
                <img src={usersSVG} alt="" class="h-4 w-4" />
            </Card.Header>
            <Card.Content>
                <p class="text-xl font-bold">{teams.length}</p>
                <p class="text-xs">
                    +{teams != "loading" &&
                        (
                            (teams.filter(
                                (t) =>
                                    new Date(t.members[0]?.timestamp) >
                                    new Date(
                                        Date.now() - 60 * 60 * 24 * 7 * 1000,
                                    ),
                            ).length /
                                teams.filter(
                                    (t) =>
                                        new Date(t.members[0]?.timestamp) <
                                        new Date(
                                            Date.now() -
                                                60 * 60 * 24 * 7 * 1000,
                                        ),
                                ).length) *
                            100
                        )
                            .toString()
                            .slice(0, 4)}% en une semaine
                </p>
            </Card.Content>
        </Card.Root>
        <Card.Root>
            <Card.Header
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <Card.Title class="text-sm font-medium">Genre</Card.Title>
                <img src={usersSVG} alt="" class="h-4 w-4" />
            </Card.Header>
            <Card.Content>
                <p class="text-xl font-bold">
                    {users != "loading" &&
                        (
                            (users.filter((u) => u.genre == "femme").length /
                                users.length) *
                            100
                        )
                            .toString()
                            .slice(0, 4)}% de filles
                </p>
                <p class="text-xs">
                    {users != "loading" &&
                        users.filter((u) => u.genre == "femme").length} filles au
                    total
                </p>
            </Card.Content>
        </Card.Root>
        <Card.Root>
            <Card.Header
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <Card.Title class="text-sm font-medium">Genre</Card.Title>
                <img src={usersSVG} alt="" class="h-4 w-4" />
            </Card.Header>
            <Card.Content>
                <p class="text-xl font-bold">
                    +{users != "loading" &&
                        (
                            (users.filter(
                                (u) =>
                                    new Date(u.timestamp) >
                                    new Date(Date.now() - 60 * 60 * 24 * 1000),
                            ).length /
                                users.filter(
                                    (u) =>
                                        new Date(u.timestamp) <
                                        new Date(
                                            Date.now() - 60 * 60 * 24 * 1000,
                                        ),
                                ).length) *
                                100 || 0
                        )
                            .toString()
                            .slice(0, 4)}% en 24h
                </p>
                <p class="text-xs">
                    +{users != "loading" &&
                        users.filter(
                            (u) =>
                                new Date(u.timestamp) >
                                new Date(Date.now() - 60 * 60 * 24 * 1000),
                        ).length} personnes en plus
                </p>
            </Card.Content>
        </Card.Root>
    </div>
    <Tabs.Root>
        <Tabs.List>
            <Tabs.Trigger value="individuals">Individus</Tabs.Trigger>
            <Tabs.Trigger value="team">Equipes</Tabs.Trigger>
        </Tabs.List>
        <Button variant="ghost" on:click={openAddTeamDialog}>
            <img src={more} alt="ajouter" class="w-4 h-4" />
            Équipe
        </Button>
        <Tabs.Content value="team">
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head class="w-[100px]">Actions</Table.Head>
                        <Table.Head>Nom</Table.Head>
                        <Table.Head>Effectifs</Table.Head>
                        <Table.Head>Date</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#if teams === "loading"}
                        <Table.Row>
                            <Table.Cell>Loading...</Table.Cell>
                        </Table.Row>
                    {:else}
                        {#each teams as team}
                            <Table.Row>
                                <Table.Cell class="flex">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        on:click={() => removeTeam(team.name)}
                                    >
                                        <img
                                            src={trash}
                                            alt=""
                                            class="h-4 w-4"
                                        />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        on:click={() =>
                                            openAddUserDialog(team.name)}
                                    >
                                        <img
                                            src={addUserSVG}
                                            alt=""
                                            class="h-4 w-4"
                                        />
                                    </Button>
                                </Table.Cell>
                                <Table.Cell class="font-medium">
                                    {team.name}
                                </Table.Cell>
                                <Table.Cell>
                                    {team.members.length}
                                </Table.Cell>
                                <Table.Cell>
                                    {new Date(
                                        team.members[0]?.timestamp,
                                    ).toLocaleDateString("fr")}
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    {/if}
                </Table.Body>
            </Table.Root>
        </Tabs.Content>
        <Tabs.Content value="individuals">
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head class="w-[100px]">Actions</Table.Head>
                        <Table.Head>
                            <button
                                on:click={() => sortBy("timestamp")}
                                class="cursor-pointer"
                            >
                                Date
                            </button>
                        </Table.Head>
                        <Table.Head>
                            <button
                                on:click={() => sortBy("first_name")}
                                class="cursor-pointer"
                            >
                                Prénom
                            </button>
                        </Table.Head>
                        <Table.Head>
                            <button
                                on:click={() => sortBy("name")}
                                class="cursor-pointer"
                            >
                                Nom
                            </button>
                        </Table.Head>
                        <Table.Head>
                            <button
                                on:click={() => sortBy("email")}
                                class="cursor-pointer"
                            >
                                Email
                            </button>
                        </Table.Head>
                        <Table.Head>
                            <button
                                on:click={() => sortBy("tel")}
                                class="cursor-pointer"
                            >
                                Tel
                            </button>
                        </Table.Head>
                        <Table.Head>
                            <button
                                on:click={() => sortBy("study")}
                                class="cursor-pointer"
                            >
                                Études
                            </button>
                        </Table.Head>
                        <Table.Head>PMR</Table.Head>
                        <Table.Head>Genre</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#if users === "loading"}
                        <Table.Row>
                            <Table.Cell>Loading...</Table.Cell>
                        </Table.Row>
                    {:else}
                        {#each users as user}
                            <Table.Row>
                                <Table.Cell class="flex">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        on:click={() => removeUser(user.email)}
                                    >
                                        <img
                                            src={trash}
                                            alt=""
                                            class="h-4 w-4"
                                        />
                                    </Button>
                                </Table.Cell>
                                <Table.Cell class="font-medium">
                                    {new Date(
                                        user.timestamp,
                                    ).toLocaleDateString("fr")}
                                </Table.Cell>
                                <Table.Cell class="font-medium">
                                    {user.first_name}
                                </Table.Cell>
                                <Table.Cell class="font-medium">
                                    {user.name}
                                </Table.Cell>
                                <Table.Cell>
                                    {user.email}
                                </Table.Cell>
                                <Table.Cell>
                                    {user.phone}
                                </Table.Cell>
                                <Table.Cell>
                                    {user.study}
                                </Table.Cell>
                                <Table.Cell>
                                    {user.pmr ? "Oui" : "Non"}
                                </Table.Cell>
                                <Table.Cell>
                                    {user.genre}
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    {/if}
                </Table.Body>
            </Table.Root>
        </Tabs.Content>
    </Tabs.Root>
</div>
