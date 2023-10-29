<script lang="ts">
    import { processCommand, type CommandResult } from "../lib/processCommand";
    import { onMount } from "svelte";
    import ndlLogo from "../assets/ndl-logo.svg";
    import close from "../assets/close.svg";
    const DEFAULT_PREFIX =
        "<span class='font-bold text-lime-500'>ndli@palme:~$ </span>";
    const ANIM_DURATION = 250;

    let currentCommand = "";
    let commmandInput: HTMLInputElement | undefined;
    let outputDiv: HTMLDivElement | undefined;
    let outputDivHeight = 0;
    let output: CommandResult[] = [];
    let prefixSpan: HTMLSpanElement | undefined;


    async function sendCommand(e: KeyboardEvent) {
        if (e.key != "Enter") return;

        if (!outputDiv) return;
        if (!prefixSpan) return;

        let commandOutput: CommandResult;
        if (output.length == 0 || output[output.length - 1].callback == null) {
            commandOutput = processCommand(currentCommand);
        } else if (output[output.length - 1].callback != null) {
            commandOutput = await output[output.length - 1].callback!(currentCommand);
        } else throw new Error("Invalid state");

        output.push(commandOutput);
        output = output;

        console.log(prefixSpan, commandOutput.nextPrefix, DEFAULT_PREFIX);

        prefixSpan.innerHTML = commandOutput.nextPrefix || DEFAULT_PREFIX;

        outputDiv.innerHTML = output
            .map((out, i, all) => {
                if (i > 0) {
                    return (
                        (all[i - 1].nextPrefix || DEFAULT_PREFIX) +
                        out.input +
                        "<br />" +
                        out.textResult.replaceAll("\n", "<br />")
                    );
                } else {
                    return (
                        DEFAULT_PREFIX +
                        out.input +
                        "<br />" +
                        out.textResult.replaceAll("\n", "<br />")
                    );
                }
            })
            .join("<br />");
        outputDivHeight = outputDiv.scrollHeight;
        currentCommand = "";

        outputDiv?.scrollTo({
            top: outputDiv.scrollHeight,
            left: 0,
            behavior: "smooth",
        });
    }

    onMount(() => {
        if (!prefixSpan) return;
        prefixSpan.innerHTML = DEFAULT_PREFIX;
        commmandInput?.focus()        
    });
</script>

<div
    class="absolute py-[3vh] h-[100vh] w-full px-[2vw] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center bg-indigo-950"
>
    <div
        class="border border-indigo-700 border-2 w-full max-h-full flex flex-col items-center rounded-[1vw] relative"
    >
        <div class="w-full h-auto py-[1vh] px-[2vw] bg-indigo-700 rounded-t-[0.6vw] flex justify-between">
            <h1 class="text-indigo-50 font-bold">Terminal d'inscription</h1>
            <img
                src={close}
                alt="fake close button"
                class="cursor-pointer stroke-slate-50"
            />
        </div>

        <div class="p-[2vw] grow shrink w-full flex flex-col justify-between max-h-full min-h-0">
            <div
                class="transition-[width] ease-in-out self-start"
                style:transition-duration={ANIM_DURATION + "ms"}
                style:width={output.length > 0 ? "10%" : "40%"}
            >
                <img src={ndlLogo} class="w-2/3" alt="la nuit de l'info" />
            </div>
            <h1 class="text-2xl font-space font-bold w-full text-indigo-100">
                Bienvenue à la nuit de l'info !
            </h1>

            <div
                class="w-full overflow-scroll transition-[height] ease-in-out grow shrink text-indigo-50 "
                style:transition-duration={ANIM_DURATION + "ms"}
                style:height={outputDivHeight + "px"}
                bind:this={outputDiv}
            />

            <div class="w-full flex">
                <p bind:this={prefixSpan} class="max-w-3/4 grow-0 shrink text-indigo-50"/>
                <input
                    class="w-full min-w-[150px] flex-1 shrink-2 outline-none border-b-2 border-indigo-50 bg-indigo-950 text-indigo-50 mx-[1vw]"
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
