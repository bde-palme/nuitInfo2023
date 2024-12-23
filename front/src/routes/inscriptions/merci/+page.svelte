<script lang="ts">
    import { browser } from "$app/environment";
    import Checkbox from "@/components/ui/checkbox/checkbox.svelte";
    import { Label } from "$lib/components/ui/label";
    import { credentials } from "@/token";
    import Button from "@/components/ui/button/button.svelte";
    import save from "../../../assets/save.svg";
    import check from "../../../assets/check.svg";
    import { goto } from "$app/navigation";

    let credValue: { team: string; token: string } | null = null;
    credentials?.subscribe((value) => {
        credValue = value;
    });

    let saved = false;

    function saveToken() {
        if (credValue) {
            localStorage.setItem("credentials", JSON.stringify(credValue));
            saved = true;
        }
    }
</script>

<div class="p-[30px]">
    <h1 class="text-2xl">Merci pour votre inscription !</h1>

    {#if browser}
        <p class="text-lg">
            Votre mot de passe d'équipe est :<br />
            <span class="text-xl font-bold">
                {$credentials?.token}
            </span>
            <br />
            Conservez le précieusement !
        </p>
        <div class="flex items-center space-x-2 my-3">
            <Button
                id="tokenSaved"
                on:click={saveToken}
                class="flex items-center justify-between"
            >
                {#if !saved}
                    <img
                        src={save}
                        alt="Sauvegarder"
                        class="w-[20px] h-[20px]"
                    />
                    <p class="ml-[10px]">Sauvegarder sur cet appareil</p>
                {:else}
                    <img
                        src={check}
                        alt="Sauvegarder"
                        class="w-[20px] h-[20px]"
                    />
                    <p class="ml-[10px]">Sauvegardé !</p>
                {/if}
            </Button>
        </div>
    {/if}

    <p>
        Nous avons bien reçu ton inscription. Nous t'enverrons un mail quelques
        jours avant l'évènement, avec toutes les informations nécessaires. Pour
        le moment, note la date du 12 avril 2024 et de l'heure de début de
        l'évènement : 18h30. On se retrouve dans l'amphi P du batiment 12D.
        Transmets les infos à tes camarades !
    </p>
    <p>
        Si vous souhaitez vous préparer pour l'évènement, nous pouvons vous
        conseiller d'apprendre à faire un site web avec HTML, CSS et JavaScript,
        ou une application mobile avec la technologie que vous souhaitez (React
        Native ou Flutter par exemple). Si vous n'avez pas du tout envie de
        coder, alors renseignez-vous sur les outils no-code comme MIT
        AppInventor, Budabase ou Alice. Des coachs seront présents pour vous
        aider, et le barème est pensé pour laisser de la place aux débutants et
        débutantes !
    </p>

    <Button on:click={() => goto("/mon-equipe/")}>
        <p>Voir mon équipe</p>
    </Button>
</div>
