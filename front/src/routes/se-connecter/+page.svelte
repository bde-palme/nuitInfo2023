<script lang="ts">
    import { browser, dev } from "$app/environment";
    import { goto } from "$app/navigation";
    import * as Card from "@/components/ui/card";
    import * as Alert from "@/components/ui/alert";
    import Checkbox from "@/components/ui/checkbox/checkbox.svelte";
    import Input from "@/components/ui/input/input.svelte";
    import Label from "@/components/ui/label/label.svelte";
    import { credentials } from "@/token";
    import Button from "@/components/ui/button/button.svelte";
    import loader from "../../assets/loader.svg";
    import { API_URL } from "@/utils";

    let teamName = "";
    $: {
        teamName = teamName.replaceAll(" ", "-").toLowerCase();
    }
    let password = "";
    let errorMessage: string | null = null;
    let staySignedIn = false;
    let loading = true;

    if (browser && $credentials?.team !== undefined) {
        console.log("init");

        teamName = $credentials.team;
        password = $credentials.token;
        loading = true;

        requestAPI().then((resp) => {
            if (resp.status == 200) {
                loading = false;
                goto("/mon-equipe/");
            } else loading = false;
        });
    } else loading = false;

    function requestAPI() {
        return fetch(`${API_URL}/api/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ teamName, password }),
        });
    }

    function signin() {
        console.log(password);

        if (teamName === "admin") {
            $credentials = { team: teamName, token: password };

            if (staySignedIn) {
                localStorage.setItem(
                    "credentials",
                    JSON.stringify({
                        team: teamName,
                        token: password,
                    }),
                );
            }

            goto("/admin");
            return;
        }

        requestAPI().then(async (resp) => {
            if (resp.status >= 300) {
                errorMessage = await resp.text();
            } else {
                $credentials = { team: teamName, token: password };
                console.log("credentials set", $credentials);

                if (staySignedIn) {
                    localStorage.setItem(
                        "credentials",
                        JSON.stringify({
                            team: teamName,
                            token: password,
                        }),
                    );
                }

                goto("/mon-equipe/");
                console.log("redirecting");
            }
        });
    }
</script>

<main class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    {#if loading}
        <div class="flex items-center space-x-2">
            <img src={loader} alt="" class="animate-spin w-5 h-5" />
            <p>Chargement</p>
        </div>
    {:else}
        <Card.Root>
            <Card.Header>
                <Card.Title>Se connecter</Card.Title>
            </Card.Header>
            <Card.Content class="flex flex-col space-y-4">
                {#if errorMessage}
                    <Alert.Root variant="destructive">
                        <Alert.Title>Erreur :'-(</Alert.Title>
                        <Alert.Description>{errorMessage}</Alert.Description>
                    </Alert.Root>
                {/if}
                <div>
                    <Label for="teamName">Nom d'équipe</Label>
                    <Input
                        id="teamName"
                        placeholder="ma-super-team"
                        type="text"
                        bind:value={teamName}
                    />
                </div>
                <div>
                    <Label for="password">Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        bind:value={password}
                    />
                </div>
                <div class="flex items-center space-x-2 my-3">
                    <Checkbox id="stay-signedin" bind:checked={staySignedIn}
                    ></Checkbox>
                    <Label for="stay-signedin">Rester connecté</Label>
                </div>
                <Button on:click={signin}>Se connecter</Button>
            </Card.Content>
            <Card.Footer>
                <div>
                    <p class="text-sm text-justify">
                        Tu as oublié le mot de passe aléatoire qui t'a donné
                        suite à ton inscription ? Tu peux passer au foyer du
                        bâtiment 12 D à Beaulieu pour qu'on voie ça ensemble.
                    </p>
                    <p class="text-sm text-justify">
                        Si tu es un participant ou une participante solo et que
                        tu souhaites modifier ton profil ou te désinscrire, fais
                        appel à un membre de l'organisation (au foyer du
                        bâtiment 12 D à Beaulieu, ou par mail à
                        bdepalme@gmail.com)
                    </p>
                </div>
            </Card.Footer>
        </Card.Root>
    {/if}
</main>
