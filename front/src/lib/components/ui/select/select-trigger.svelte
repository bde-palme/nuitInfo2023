<script lang="ts">
    import { Select as SelectPrimitive } from "bits-ui";
    import chevronDown from "./chevron_down.svg";
    import { cn } from "$lib/utils";

    type $$Props = SelectPrimitive.TriggerProps;
    type $$Events = SelectPrimitive.TriggerEvents;

    let className: $$Props["class"] = undefined;
    export { className as class };
</script>

<SelectPrimitive.Trigger
    class={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 line-clamp-1 truncate",
        className,
    )}
    {...$$restProps}
    let:builder
    on:click
    on:keydown
>
    <slot {builder} />
    <div>
        <img
            src={chevronDown}
            class="h-4 w-4 transition-transform duration-200"
            alt="chevron down"
        />
    </div>
</SelectPrimitive.Trigger>
