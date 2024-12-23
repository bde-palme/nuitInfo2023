<script>
</script>

<main class="flex h-[100vh] w-[100vw] overflow-hidden">
    <div
        class="hidden md:block w-1/2 h-[100vh] bg-[url(/src/assets/hero-baniere.svg)] bg-center bg-cover"
    ></div>
    <div class="flex justify-center items-center w-full md:w-1/2 h-full">
        <slot />
    </div>
</main>
