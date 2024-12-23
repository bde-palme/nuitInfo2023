<script lang="ts">
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import type { Member } from "$lib/member";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import * as Card from "$lib/components/ui/card";
    import trash from "../assets/trash.svg";
    import Button from "$lib/components/ui/button/button.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import * as Select from "$lib/components/ui/select";
    import type { Selected } from "bits-ui";

    export let member: Member;
    export let title: string;
    export let trashable: boolean;
    export let error: boolean;

    function validate() {
        error = Object.entries(inputs).some(
            ([inputName, input]) => !input.regex.test(member[inputName]),
        );
        console.log(error);
        if (error) {
            let field = Object.entries(inputs).find(
                ([inputName, input]) => !input.regex.test(member[inputName]),
            );
            console.log(field);
        }
    }

    const dispatch = createEventDispatcher();

    interface InputDesc {
        label: string;
        type: string;
        id: string;
        regex: RegExp;
        required: boolean;
        error: boolean;
        selectedOption?: Selected<string>;
        options?: { value: string }[];
    }

    const inputs: { [field: string]: InputDesc } = {
        first_name: {
            label: "Prénom",
            type: "text",
            id: "prénom" + title,
            regex: /^[a-zA-ZÀ-ÿ\s-]+$/,
            required: true,
            error: false,
        },
        name: {
            label: "Nom",
            type: "text",
            id: "nom" + title,
            regex: /^[a-zA-ZÀ-ÿ\s-]+$/,
            required: true,
            error: false,
        },
        email: {
            label: "Email",
            type: "email",
            id: "email" + title,
            regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            required: true,
            error: false,
        },
        phone: {
            label: "Téléphone",
            type: "tel",
            id: "phone" + title,
            regex: /^0[1-9][0-9]{8}$/,
            required: true,
            error: false,
        },
        study: {
            label: "Études poursuivie (établissement et formation)",
            type: "text",
            id: "study" + title,
            regex: /^[a-zA-Z0-9À-ÿ\s-]+$/,
            required: true,
            error: false,
        },
        nickname: {
            label: "Pseudo Discord",
            type: "text",
            id: "nickname" + title,
            regex: /^[a-zA-Z0-9À-ÿ\s-]+$/,
            required: false,
            error: false,
        },
        genre: {
            label: "Genre",
            type: "select",
            id: "genre" + title,
            regex: /^homme|femme|ne se prononce pas$/,
            required: true,
            error: false,
            options: [
                { value: "homme" },
                { value: "femme" },
                { value: "ne se prononce pas" },
            ],
            selectedOption: { value: "ne se prononce pas" },
        },
        pmr: {
            label: "En situation de mobilité réduite",
            type: "checkbox",
            id: "pmr" + title,
            regex: /true|false/,
            required: false,
            error: false,
        },
    };
</script>

<Card.Root class="w-full">
    <Card.Header>
        <Card.Title class="w-full flex justify-between items-center">
            <span>{title}</span>
            {#if trashable}
                <Button
                    variant="ghost"
                    class="w-[30px] h-[30px] p-[5px]"
                    on:click={() => dispatch("trashed")}
                >
                    <img src={trash} alt="retirer" />
                </Button>
            {/if}
        </Card.Title>
    </Card.Header>
    <Card.Content>
        {#each Object.keys(inputs) as input}
            <div class="mb-3">
                {#if inputs[input].type == "checkbox"}
                    <div class="flex items-center space-x-2 my-3">
                        <Checkbox id={"pmr" + title} bind:checked={member.pmr}
                        ></Checkbox>
                        <Label for={"pmr" + title}>{inputs[input].label}</Label>
                    </div>
                {:else if inputs[input].type == "select"}
                    <Select.Root
                        items={[
                            { value: "homme" },
                            { value: "femme" },
                            { value: "ne se prononce pas" },
                        ]}
                        bind:selected={inputs[input].selectedOption}
                        onSelectedChange={(e) => {
                            validate();
                            member[input] = e.value;
                        }}
                    >
                        <Label for="genre">{inputs[input].label}</Label>
                        <Select.Trigger class="flex">
                            <Select.Value placeholder="Choisir..." />
                        </Select.Trigger>
                        <Select.Content>
                            {#each inputs[input].options || [] as option}
                                <Select.Item value={option.value}>
                                    {option.value}
                                </Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Root>
                {:else}
                    <Label
                        for={inputs[input].id}
                        class={inputs[input].error ? "text-red-500" : ""}
                        >{inputs[input].label}</Label
                    >
                    <Input
                        type={inputs[input].type}
                        id={inputs[input].id}
                        bind:value={member[input]}
                        on:focusout={() => {
                            inputs[input].error = !inputs[input].regex.test(
                                member[input],
                            );
                            validate();
                        }}
                        required={inputs[input].required}
                        class={inputs[input].error
                            ? "border-red-500 transition-[border] duration-300"
                            : ""}
                    />
                    {#if inputs[input].error}
                        <p class="text-red-500 text-xs">Champ invalide</p>
                    {/if}
                {/if}
            </div>
        {/each}
    </Card.Content>
</Card.Root>
