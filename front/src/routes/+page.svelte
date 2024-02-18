<script lang="ts">
    import { dev } from "$app/environment";
    import Button from "$lib/components/ui/button/button.svelte";
    import user from "../assets/user.svg";
    import arrow from "../assets/arrow.svg";
    import { goto } from "$app/navigation";
    import image1 from "../assets/home/image1.svg";
    import image2 from "../assets/home/image2.png";
</script>

<main class="flex flex-col items-center space-y-[50px]">
    <nav
        class="w-full flex justify-between items-center border-b-[1px] border-[rgba(70, 87, 90, 0.7) px-4 fixed z-10 backdrop-blur bg-white/90"
    >
        <p>Hack Ta Fac !</p>
        <Button
            class="bg-transparent text-black hover:bg-transparent hover:text-[#F35EEA] flex space-x-3"
            on:click={() => goto("/se-connecter")}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-user w-4 h-4 stroke-current"
            >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
            <p>Connexion</p>
        </Button>
    </nav>
    <section class="w-[90vw] h-[60vh] relative">
        <div
            class="w-full h-full overflow-hidden rounded-[30px] bg-[url(/src/assets/hero-baniere.svg)] bg-center bg-cover border-[1px] border-[rgba(70, 87, 90, 0.7)]"
        ></div>
        <div
            class="absolute top-100 w-[65vw] lg:max-w-[396px] h-[15vh] left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full text-black flex items-center justify-center"
        >
            <Button
                class="rounded-full flex items-center space-x-4 hover:bg-[#F35EEA]"
                on:click={() => goto("/inscriptions")}
            >
                <p>Je m'inscris !</p>
                <img src={arrow} alt="arrow" class="w-4 h-4" />
            </Button>
        </div>
    </section>
    <section class="w-[90vw] flex flex-col space-y-3">
        <h1
            class="text-2xl lg:text-4xl font-bold py-4 border-b-[1px] border-[rgba(70, 87, 90, 0.7)"
        >
            Hack Ta Fac : Viens courir un hackathon !
        </h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 place-items-center">
            <img src={image1} alt="" class="lg:order-last w-[400px]" />
            <p class="text-justify w-full">
                Hack Ta Fac c'est 24 heures pour trouver une idée d'outil
                numérique qui permettra de révolutionner une thématique de
                société. Le 5 avril à 18h30, on vous révèlera un thème et vous
                aurez jusqu'au lendemain à la même heure pour trouver une idée
                d'outils numériques, et réaliser un prototype. À la fin, vous
                présenterez votre projet en quelques minutes devant les autres
                équipes et un jury. Vous ne connaissez rien à la programmation,
                pire, ça vous ennuie profondément ? Mais avez-vous testé cette
                discipline en dehors des cours ? Croyez-nous, un hackathon,
                c'est le genre d'expérience à vivre au moins une fois dans sa
                vie, et qui vous fera changer d'avis. En plus, aucune compétence
                n'est requise pour terminer sur le podium : des coachs sont là
                pour vous guider, et le barème de notation est pensé pour
                favoriser l'idée et la présentation plutôt que la technique.
                Alors, prêt à relever le défi ?
            </p>
        </div>
    </section>
    <section class="w-[90vw] flex flex-col space-y-3">
        <h1
            class="text-2xl lg:text-4xl font-bold py-4 border-b-[1px] border-[rgba(70, 87, 90, 0.7)] lg:text-right"
        >
            Non, c'est pas un truc de geek !
        </h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 place-items-center">
            <img src={image2} alt="" />
            <p class="text-justify w-full">
                Notre objectif est clair : démocratiser l'hackathon et
                l'informatique. Alors, si tu n'as pas l'impression que c'est
                fait pour toi, c'est que c'est fait pour toi ! On a créé un
                barème pour qu'un complet débutant ou une complète débutante
                puisse gagner, et on a prévu des coachs pour aider les équipes.
                Tout est permis : du site web à l'application mobile, en passant
                par le PowerPoint dynamique ou l'appli faite avec AppInventor.
                Tant que vous réussissez à convaincre le jury avec un prototype
                qui est ou semble être fonctionnel, vous avez toutes vos
                chances. On insiste : les hackathons, ce n'est pas pour les
                geeks. C'est social, c'est mental, c'est sportif ! C'est une
                expérience rocambolesque qui renforce des amitiés (ou les brise,
                à voir comment vous saurez vous organiser) ! Vous allez galérer,
                ne pas savoir comment avancer, être bloqués, jusqu'à ce que
                soudain, miracle, ça marche ! Vous allez devoir vous battre
                contre vous-même pour ne pas abandonner. Vous allez devoir
                travailler en équipe, c'est-à-dire, saboter le travail de votre
                équipe pendant qu'elle sabote le vôtre ! Vous allez devoir faire
                une présentation convaincante et jouer d'astuces pour qu'on ne
                remarque pas les bugs, mais qu'on soit quand même impressionné
                par le résultat. Bref, une aventure vous attend, oserez-vous la
                vivre ?
            </p>
        </div>
    </section>
    <section class="w-[90vw] flex flex-col space-y-3">
        <h1
            class="text-2xl lg:text-4xl font-bold py-4 border-b-[1px] border-[rgba(70, 87, 90, 0.7)]"
        >
            Comment ça se passe ?
        </h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
            <p class="text-justify w-full">
                La problématique te sera révélée le 5 avril à 18h30. Tu auras
                alors 24h avec ton équipe pour trouver votre idée et créer votre
                prototype. À 17h30, le 6 avril, tu devras présenter ton projet
                devant les autres équipes et un jury, et les résultats seront
                annoncés dans la foulée. Jusqu'à 19h30, on remettra les lots et
                on se félicitera tous ensemble. Le 5 avril au soir, vous sera
                servi un repas (gratuit !) tout comme le lendemain matin pour le
                petit déjeuner, et le midi aussi. Tout au long des 24h, des
                snacks seront à disposition ainsi que des boissons chaudes et
                froides. Bien sûr, des camions citernes de café seront commandés
                ! Des coachs seront là pour vous aider et vous guider pour
                trouver une idée et réaliser un prototype.
            </p>
            <Button
                on:click={() => goto("/inscriptions")}
                class="flex space-x-2 rounded-full hover:bg-[#F35EEA]"
            >
                <p>De la nourriture gratuite ?! Je m'inscris !</p>
                <img src={arrow} alt="arrow" class="w-4 h-4" />
            </Button>
        </div>
    </section>
    <section class="w-[90vw] flex flex-col space-y-3">
        <h1
            class="text-2xl lg:text-4xl font-bold py-4 border-b-[1px] border-[rgba(70, 87, 90, 0.7)] lg:text-right"
        >
            C'est quoi le sujet ?
        </h1>
        <div>
            <div>
                <p class="p-4 text-justify w-full">
                    Vous allez avoir 24h pour trouver une idée d'outils
                    numériques et réaliser un prototype, pour répondre à une
                    problématique de société. La dernière heure sera consacrée à
                    la présentation de votre projet devant les autres équipes et
                    un jury. Votre prototype peut avoir n'importe quelle forme :
                    site web, application mobile, PowerPoint dynamique,
                    application faite avec AppInventor (aucun code requis), etc.
                    <br />
                    Le barème de notation est le suivant, et est pensé pour favoriser
                    l'idée et la présentation plutôt que la technique :
                </p>
            </div>

            <ul class="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-4">
                <li
                    class="border-sky-900/900 border-[1px] p-4 rounded-[10px] flex flex-col space-y-4"
                >
                    <span class="text-xl font-bold">Idée :</span>
                    <ul class="ml-4 flex-col space-y-4">
                        <li class="flex items-center space-x-4">
                            <span class="bg-sky-100 block p-4 rounded-[10px]"
                                ><b>Potentiel de l'idée :</b> en considérant que
                                votre projet est mis en place de manière optimale,
                                quel serait son impact ?</span
                            >
                            <span class="whitespace-nowrap font-bold"
                                >/ 2.5 pts</span
                            >
                        </li>
                        <li class="flex items-center space-x-4">
                            <span class="bg-sky-100 block p-4 rounded-[10px]">
                                <b>viabilité</b> : possibilité de mise en place facilement.</span
                            >
                            <span class="whitespace-nowrap font-bold"
                                >/ 1 pts
                            </span>
                        </li>
                        <li class="flex items-center space-x-4">
                            <span class="bg-sky-100 block p-4 rounded-[10px]"
                                ><b>Originalité, caractère innovant</b></span
                            >
                            <span class="whitespace-nowrap font-bold"
                                >/ 0.5 pts
                            </span>
                        </li>
                    </ul>
                </li>
                <li
                    class="border-[1px] border-sky-900/900 p-4 rounded-[10px] flex flex-col space-y-4"
                >
                    <span class="text-xl font-bold">Mise en place :</span>
                    <ul class="ml-4 flex-col space-y-4">
                        <li
                            class="flex flex-col space-x-4 border-sky-900/900 border-[1px] rounded-[10px] p-4"
                        >
                            <span class="text-lg font-bold"
                                >Présentation et démonstration</span
                            >
                            <ul class="flex flex-col space-y-4">
                                <li class="flex items-center space-x-4">
                                    <span
                                        class="bg-sky-100 block p-4 rounded-[10px]"
                                    >
                                        <b
                                            >Éloquence, présentation
                                            convaincante</b
                                        >
                                    </span>
                                    <span class="whitespace-nowrap font-bold">
                                        / 3 pts
                                    </span>
                                </li>
                                <li class="flex items-center space-x-4">
                                    <span
                                        class="bg-sky-100 block p-4 rounded-[10px]"
                                    >
                                        <b>qualité du prototype :</b>
                                        a t'il nécessité du talent pour être créer
                                        (technique, visuel, son...) ?
                                    </span>
                                    <span class="whitespace-nowrap font-bold">
                                        / 1 pts
                                    </span>
                                </li>
                            </ul>
                        </li>

                        <li class="flex items-center space-x-4">
                            <span class="bg-sky-100 block p-4 rounded-[10px]">
                                <b>Aboutissement :</b> à quel point le projet est
                                terminé et pourrait être mis en place tel quel.
                            </span>
                            <span class="whitespace-nowrap font-bold"
                                >/ 1 pts
                            </span>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </section>
</main>
