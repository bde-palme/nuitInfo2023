<script lang="ts">
    // TODO :
    // - edition team
    // - mobile responsive

    import { processCommand, type CommandResult } from "../lib/processCommand";
    import { onMount } from "svelte";
    import ndlLogo from "../assets/ndl-logo.svg";
    import close from "../assets/close.svg";
    import undo from "../assets/undo.svg";
    const DEFAULT_PREFIX =
        "<span class='font-bold text-lime-500'>ndli@palme:~$ </span>";
    const ANIM_DURATION = 250;

    let currentCommand = "";
    let commmandInput: HTMLInputElement | undefined;
    let outputDiv: HTMLDivElement | undefined;
    let outputDivHeight = 0;
    let outputsFromStart: CommandResult[] = [];
    let prefixSpan: HTMLSpanElement | undefined;

    const FIRST_TEXT = `Bienvenue sur le terminal d'inscription de la nuit de l'info ! <br>
        La nuit de l'info est un hackathon national qui aura lieu du 7 au 8 décembre. Vous aurez toute la nuit pour créer un site web sur un thème national. En plus, vous pourrez choisir des défis, qui sont des contraintes supplémentaires qui vous permettront de gagner des lots (jusqu'à 5 défis et donc 5 lots par équipe). <br>
        Ce hackathon est national, et se déroule sur plusieurs sites en France. Ici, c'est pour vous inscrire au site de Beaulieu, à Rennes (ISTIC, batiment 12D). <br>
        Une fois que vous serez inscrit·e, on s'occupe de tout : vous serez inscrit·e à l'échelle nationale, un repas vous sera offert, et les portes de l'ISTIC vous seront ouverte.<br>
        L'inscription se fait grâce à ce terminal froid et austère... Pour commencer, tapez "start" !<br />`;

    async function sendCommand(e: KeyboardEvent) {
        if (e.key != "Enter") return;

        outputsFromStart.push(await callCommand(currentCommand.trim()));
        outputsFromStart = outputsFromStart;
        currentCommand = "";
        updateTerminalContent(outputsFromStart);
    }

    async function callCommand(command: string): Promise<CommandResult> {
        let commandOutput: CommandResult;
        if (
            outputsFromStart.length == 0 ||
            outputsFromStart[outputsFromStart.length - 1].callback == null
        ) {
            commandOutput = processCommand(command);
        } else if (
            outputsFromStart[outputsFromStart.length - 1].callback != null
        ) {
            commandOutput = await outputsFromStart[outputsFromStart.length - 1]
                .callback!(command);
        } else throw new Error("Invalid state");

        return commandOutput;
    }

    function updateTerminalContent(outputsFromStart: CommandResult[]) {
        if (!outputDiv) return;
        if (!prefixSpan) return;

        let lastOutput =
            outputsFromStart.length > 0
                ? outputsFromStart[outputsFromStart.length - 1]
                : null;
        prefixSpan.innerHTML = lastOutput?.nextPrefix || DEFAULT_PREFIX;

        const textOutput =
            FIRST_TEXT +
            outputsFromStart
                .map((out, i, all) => {
                    if (i > 0) {
                        return (
                            (all[i - 1].nextPrefix || DEFAULT_PREFIX) +
                            "<span class='text-red-400'>" +
                            out.input +
                            "</span>" +
                            "<br />" +
                            out.textResult.replaceAll("\n", "<br />")
                        );
                    } else {
                        return (
                            DEFAULT_PREFIX +
                            "<span class='text-red-400'>" +
                            out.input +
                            "</span>" +
                            "<br />" +
                            out.textResult.replaceAll("\n", "<br />")
                        );
                    }
                })
                .join("<br />");

        outputDiv.innerHTML = textOutput;
        console.log(outputDiv.scrollHeight);

        outputDiv?.scrollTo({
            top: outputDiv.scrollHeight,
            left: 0,
            behavior: "smooth",
        });
    }

    function back() {
        outputsFromStart.pop();
        if (outputsFromStart.length > 0) {
            callCommand(outputsFromStart[outputsFromStart.length - 1].input);
            updateTerminalContent(outputsFromStart);
        } else {
            clear();
            updateTerminalContent(outputsFromStart);
        }
    }

    function clear() {
        if (!prefixSpan) return;
        outputsFromStart = [];
        prefixSpan.innerHTML = DEFAULT_PREFIX;
    }

    onMount(() => {
        clear();
        commmandInput?.focus();
        if (!outputDiv) return;
        outputDiv.innerHTML = FIRST_TEXT;
    });
</script>

<div
    class="absolute h-[100vh] w-full py-[3vh] px-[2vw] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center bg-indigo-950"
>
    <div
        class="border border-indigo-700 border-2 w-full max-h-full shrink flex flex-col items-center rounded-[1vw] relative"
    >
        <div
            class="w-full h-auto py-[1vh] px-[2vw] bg-indigo-700 rounded-t-[0.6vw] flex justify-between"
        >
            <h1 class="text-indigo-50 font-bold">Terminal d'inscription</h1>
            <img
                src={close}
                alt="fake close button"
                class="cursor-pointer stroke-slate-50"
            />
        </div>

        <div
            class="p-[2vw] grow shrink w-full flex flex-col justify-between max-h-full min-h-0 relative"
        >
            <button
                class="bg-indigo-600 hover:bg-indigo-400 active:scale-[0.9] transition-all
                text-indigo-50 font-bold p-1 rounded-[10px] flex justify-between
                absolute right-[2vw] top-[2vw]"
                on:click={back}
            >
                <img src={undo} alt="undo" />
            </button>

            {#if outputsFromStart.length == 0}
                <img
                    src={ndlLogo}
                    class="transition-[height] ease-in-out self-start h-[10vh] w-auto"
                    alt="la nuit de l'info"
                />

                <h1
                    class="text-2xl font-space font-bold w-full text-indigo-100"
                >
                    Bienvenue à la nuit de l'info !
                </h1>
            {/if}

            <div
                class="w-full overflow-scroll transition-[height] h-auto ease-in-out grow shrink text-indigo-50
                scrollbar scrollbar-thumb-indigo-900 scrollbar-track-indigo-950 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                style:transition-duration={ANIM_DURATION + "ms"}
                bind:this={outputDiv}
            />

            <div class="w-full flex items-center">
                <p
                    bind:this={prefixSpan}
                    class="max-w-3/4 grow-0 shrink text-indigo-50"
                />
                <input
                    class="w-full min-w-[150px] flex-1 shrink-2 outline-none border-b-2 border-indigo-50 bg-indigo-950 font-bold text-red-400 mx-[1vw]"
                    on:keydown={sendCommand}
                    bind:value={currentCommand}
                    bind:this={commmandInput}
                />
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        height: 100vh;
    }
</style>
