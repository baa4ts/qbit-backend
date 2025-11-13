import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --- Categorías expandidas ---
  const categoriasData = [
    "Acción", "Aventura", "Roguelike", "Estrategia", "Simulación",
    "Terror", "Construcción", "Deportes", "Multijugador", "Supervivencia",
    "Carreras", "Puzzle", "Musical", "Horror", "FPS", "RPG", "MMO",
    "Battle Royale", "Plataformas", "Indie", "Arcade", "Shooter",
    "Sandbox", "Mundo Abierto", "Sci-Fi", "Fantasía", "Anime"
  ].map(nombre => ({ nombre }));

  await prisma.categoria.createMany({ data: categoriasData });
  const categorias = await prisma.categoria.findMany();

  // --- Usuarios normales expandidos ---
  const usuariosNormalesData = [
    { nombre: "Yei Axel Ridgnay Cardozo", email: "yay@yay.com", permiso: 1, password: "$2a$10$ZVzzeUeLjGITp60eENsV2.jBMa3hLVPUipiT7O7mhnPJ4CklW/nFe", icono: "https://i.pinimg.com/736x/eb/87/17/eb87176b387f1a1ea97ea72606782e9a.jpg", biografia: "Soy el senior de la noshe muy rico y muy oscuro grrr" },
    { nombre: "Mauricio Lopez", email: "mau@mau.com", permiso: 1, password: "$2a$10$ZVzzeUeLjGITp60eENsV2.jBMa3hLVPUipiT7O7mhnPJ4CklW/nFe", icono: "https://i.pinimg.com/736x/7d/45/0f/7d450fd403d4daa9491867cef6ab556a.jpg", biografia: "Ser zofilico de lagartos no es facil. Un dia compras uno por curiosidad y al mes estas cocinando arroz con grillos para los dos mientras te mira con decepcion." },
    { nombre: "Ana Gomez", email: "ana@example.com", permiso: 1, password: "1234", icono: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" },
    { nombre: "Carlos Ruiz", email: "carlos@example.com", permiso: 1, password: "1234", icono: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    { nombre: "Maria Lopez", email: "maria@example.com", permiso: 1, password: "1234", icono: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
    { nombre: "Pedro Sanchez", email: "pedro@example.com", permiso: 1, password: "1234", icono: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
    { nombre: "Laura Martinez", email: "laura@example.com", permiso: 1, password: "1234", icono: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" },
    { nombre: "David Garcia", email: "david@example.com", permiso: 1, password: "1234", icono: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face" },
    { nombre: "Elena Rodriguez", email: "elena@example.com", permiso: 1, password: "1234", icono: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face" },
    { nombre: "Sofia Mora", email: "sof@sof.com", permiso: 1, password: "$2a$10$ZVzzeUeLjGITp60eENsV2.jBMa3hLVPUipiT7O7mhnPJ4CklW/nFe", icono: "https://i.pinimg.com/736x/4e/b2/32/4eb23273c0de20f889d03436135c2787.jpg", biografia: "(Acento cubano) odio a lo cubano, chico" }
  ];

  const usuarios = [];
  for (let u of usuariosNormalesData) {
    const user = await prisma.usuario.create({ data: u });
    usuarios.push(user);
  }

  // --- Desarrolladores expandidos ---
  const devsData = [
    {
      nombre: "Hideo Kojima",
      email: "hideo@kojimaproductions.com",
      permiso: 2,
      password: "$2a$10$ZVzzeUeLjGITp60eENsV2.jBMa3hLVPUipiT7O7mhnPJ4CklW/nFe",
      icono: "https://i.pinimg.com/736x/ff/2c/14/ff2c14f9a3d80212e9264652d1a6212a.jpg",
      biografia: "Director de videojuegos japonés, fundador de Kojima Productions. Creador de Metal Gear Solid y Death Stranding."
    }, {
      nombre: "Carlos Morales",
      email: "baa4ts@gmail.com",
      permiso: 2,
      password: "$2a$10$SL7/Os45/aXNnT0PDnPzaeBAi87Js7IsbItRt.kfF1dYDewso4TLa",
      icono: "https://i.pinimg.com/736x/cb/96/f7/cb96f77a6190f553b0c2e0bc142cb2f6.jpg",
      biografia: "Un videojuego mas"
    },
    {
      nombre: "Shigeru Miyamoto",
      email: "miyamoto@nintendo.com",
      permiso: 2,
      password: "1234",
      icono: "https://i.pinimg.com/736x/1b/6d/71/1b6d7163a52b3747c1279d88b09592b8.jpg",
      biografia: "Diseñador de videojuegos japonés en Nintendo, creador de franquicias como Mario, The Legend of Zelda y Donkey Kong."
    },
    {
      nombre: "Todd Howard",
      email: "todd@bethesda.net",
      permiso: 2,
      password: "1234",
      icono: "https://i.pinimg.com/1200x/3d/0f/23/3d0f23315936fb369257f0442f3ef242.jpg",
      biografia: "Director de videojuegos estadounidense en Bethesda Game Studios, conocido por The Elder Scrolls y Fallout."
    },
    {
      nombre: "Gabe Newell",
      email: "gaben@valvesoftware.com",
      permiso: 2,
      password: "1234",
      icono: "https://i.pinimg.com/736x/27/21/85/2721852da0db2628691bff5e3da4abc3.jpg",
      biografia: "Cofundador y presidente de Valve Corporation, responsable de Half-Life, Portal y Steam."
    },
    {
      nombre: "Hidetaka Miyazaki",
      email: "miyazaki@fromsoftware.jp",
      permiso: 2,
      password: "1234",
      icono: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Hidetaka_Miyazaki_%28cropped%29.jpg/800px-Hidetaka_Miyazaki_%28cropped%29.jpg",
      biografia: "Director de videojuegos japonés y presidente de FromSoftware, creador de Dark Souls, Bloodborne y Elden Ring."
    },
    {
      nombre: "Neil Druckmann",
      email: "neil@naughtydog.com",
      permiso: 2,
      password: "1234",
      icono: "https://i.pinimg.com/736x/c6/f1/8f/c6f18ff16952986f9be4effd40282ba0.jpg",
      biografia: "Director creativo de Naughty Dog, conocido por The Last of Us y Uncharted."
    }, {
      nombre: "Adolf Games",
      email: "adolfito@3reich.al",
      permiso: 2,
      password: "$2a$10$ZVzzeUeLjGITp60eENsV2.jBMa3hLVPUipiT7O7mhnPJ4CklW/nFe",
      icono: "https://i.kym-cdn.com/entries/icons/original/000/030/741/hitler.jpg",
      biografia: "Desarollador oficial de la saga sex withe hittler."
    },
    {
      nombre: "naelstrof",
      email: "naelstrof@github.com",
      permiso: 2,
      password: "$2a$10$ZVzzeUeLjGITp60eENsV2.jBMa3hLVPUipiT7O7mhnPJ4CklW/nFe",
      icono: "https://avatars.githubusercontent.com/u/1131571?v=4",
      biografia: "A stealth action game, where instead of eliminating targets with a gun, you eliminate them with your cock!"
    },
  ];

  const devs = [];
  for (let dev of devsData) {
    const d = await prisma.usuario.create({ data: dev });
    devs.push(d);
  }

  // --- Juegos masivos expandidos ---
  const juegosData = [
    // Juegos de Hideo Kojima
    {
      titulo: "Death Stranding Director's Cut",
      slug: "death-stranding-directors-cut",
      precio: 39.99,
      descripcion: "Un viaje épico a través de un Estados Unidos post-apocalíptico, conectando ciudades aisladas y sobrevivientes.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/header.jpg",
      descarga: "https://store.steampowered.com/app/1850570/Death_Stranding_Directors_Cut/",
      autorId: devs[0].id,
      categorias: ["Acción", "Aventura", "Sci-Fi"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_4b6d7d010d1701b2b57bf8ef1b4975a04b3d632f.1920x1080.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_bc8812817c074772822c1d1e8a6b016983cf05e8.1920x1080.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_d47bde2e349606b3ef1f641e2d8fb7ccf1adba77.1920x1080.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_8f0a2b1f6ea6da05c53f802034e08cbe92aaccab.1920x1080.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_73eb002b5070299aae3727bd07ce6d51e4a82b10.1920x1080.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_fa063b095344e747a8920d06b5be1d99e3d8789a.1920x1080.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_87653eb3d360766a994adccd82767b34961b37a5.1920x1080.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_0be4ab0e4137c880b1eda9e405a77bc2e3539695.1920x1080.jpg" },
      ]
    },
    {
      titulo: "Metal Gear Solid V: The Phantom Pain",
      slug: "metal-gear-solid-v",
      precio: 29.99,
      descripcion: "La experiencia definitiva de infiltración táctical en mundo abierto.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/287700/header.jpg",
      descarga: "https://store.steampowered.com/app/287700/Metal_Gear_Solid_V_The_Phantom_Pain/",
      autorId: devs[0].id,
      categorias: ["Acción", "Stealth", "Mundo Abierto"],
      recursos: [
        { tipo: "video", recurso: "https://assets3.ign.com/videos/zencoder/2016/10/10/1920/1dcb9e5022aec8551670ad814883def2-5000000-1476114814-w.mp4" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/287700/ss_d4c1b17dad6eeeef8e1ade44a66d8e644afcc4e6.1920x1080.jpg?t=1727849445" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/287700/ss_969065fca2ad4538c2e7ed5d8bbd91cbd060cf47.1920x1080.jpg?t=1727849445" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/287700/ss_dec3093b6d3ad9b688fd08df420c0f1053abc881.1920x1080.jpg?t=1727849445" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/287700/ss_0b38ffb37180ffbadcc0c1d645f65b59c5861d1b.1920x1080.jpg?t=1727849445" },
      ]
    },

    // Juegos de Nintendo/Miyamoto
    {
      titulo: "The Legend of Zelda: Breath of the Wild",
      slug: "zelda-breath-wild",
      precio: 59.99,
      descripcion: "Explora el vasto reino de Hyrule en esta aventura épica que redefine la serie Zelda.",
      banner: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58",
      descarga: "https://www.nintendo.com/store/products/the-legend-of-zelda-breath-of-the-wild-switch/",
      autorId: devs[1].id,
      categorias: ["Aventura", "Mundo Abierto", "RPG", "Fantasía"],
      recursos: [
        { tipo: "imagen", recurso: "https://www.nintendo.com/eu/media/images/06_screenshots/games_5/nintendo_switch_6/nswitch_thelegendofzeldabreathofthewild/NSwitch_TheLegendOfZeldaBreathOfTheWild_01_TM_Standard.png" },
        { tipo: "imagen", recurso: "https://www.nintendo.com/eu/media/images/06_screenshots/games_5/nintendo_switch_6/nswitch_thelegendofzeldabreathofthewild/NSwitch_TheLegendOfZeldaBreathOfTheWild_02_TM_Standard.png" },
        { tipo: "imagen", recurso: "https://www.nintendo.com/eu/media/images/06_screenshots/games_5/nintendo_switch_6/nswitch_thelegendofzeldabreathofthewild/NSwitch_TheLegendOfZeldaBreathOfTheWild_03_TM_Standard.png" },
        { tipo: "imagen", recurso: "https://www.nintendo.com/eu/media/images/06_screenshots/games_5/nintendo_switch_6/nswitch_thelegendofzeldabreathofthewild/NSwitch_TheLegendOfZeldaBreathOfTheWild_04_TM_Standard.png" },
        { tipo: "imagen", recurso: "https://www.nintendo.com/eu/media/images/06_screenshots/games_5/nintendo_switch_6/nswitch_thelegendofzeldabreathofthewild/NSwitch_TheLegendOfZeldaBreathOfTheWild_04_TM_Standard.png" },
        { tipo: "imagen", recurso: "https://www.nintendo.com/eu/media/images/06_screenshots/games_5/nintendo_switch_6/nswitch_thelegendofzeldabreathofthewild/NSwitch_TheLegendOfZeldaBreathOfTheWild_06_TM_Standard.png" },
      ]
    },
    {
      titulo: "Super Mario Odyssey",
      slug: "super-mario-odyssey",
      precio: 49.99,
      descripcion: "Únete a Mario en una aventura épica alrededor del mundo para rescatar a la Princesa Peach de Bowser.",
      banner: "https://i.pinimg.com/736x/aa/38/64/aa3864b6ffff42758ac8ff6b7be7303c.jpg",
      descarga: "https://www.nintendo.com/store/products/super-mario-odyssey-switch/",
      autorId: devs[1].id,
      categorias: ["Plataformas", "Aventura", "Familia"],
      recursos: [
        { tipo: "imagen", recurso: "https://i.pinimg.com/736x/2c/96/dc/2c96dcea11bd167f19f51f3621c18b34.jpg" },
        { tipo: "imagen", recurso: "https://i.pinimg.com/736x/6a/69/91/6a6991fdefb2d6b1b2c23bfe452d40bb.jpg" },
        { tipo: "imagen", recurso: "https://i.pinimg.com/736x/f6/06/b9/f606b9408e792b10f1a8ee7760ed6266.jpg" },
        { tipo: "imagen", recurso: "https://i.pinimg.com/736x/6a/69/91/6a6991fdefb2d6b1b2c23bfe452d40bb.jpg" },
      ]
    },

    // Juegos de Bethesda/Todd Howard
    {
      titulo: "The Elder Scrolls V: Skyrim Anniversary Edition",
      slug: "skyrim-anniversary",
      precio: 49.99,
      descripcion: "La edición definitiva del galardonado juego de rol, con todo el contenido oficial.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1746860/header.jpg",
      descarga: "https://store.steampowered.com/app/1746860/The_Elder_Scrolls_V_Skyrim_Anniversary_Edition/",
      autorId: devs[2].id,
      categorias: ["RPG", "Mundo Abierto", "Fantasía", "Aventura"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1746860/ss_ea4d71cbc9d36ef3bcf0e86c7d75d2d4dfec56b8.1920x1080.jpg?t=1726757961" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1746860/ss_e28f5e3ad356a1850d86b6cc43ca60afc365de65.1920x1080.jpg?t=1726757961" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1746860/ss_ff16ecb553491d621feced2267c76b4083287dbb.1920x1080.jpg?t=1726757961" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1746860/ss_b0c417d87a84655710f2ec094719ac9bdb6b9a01.1920x1080.jpg?t=1726757961" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1746860/ss_b862659b58a7c28528c2e811d64ea04c5ac5361f.1920x1080.jpg?t=1726757961" },
      ]
    },
    {
      titulo: "Starfield",
      slug: "starfield",
      precio: 69.99,
      descripcion: "El próximo juego de rol épico de Bethesda Game Studios ambientado en el espacio.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg",
      descarga: "https://store.steampowered.com/app/1716740/Starfield/",
      autorId: devs[2].id,
      categorias: ["RPG", "Sci-Fi", "Mundo Abierto", "Espacio"],
      recursos: [
        { tipo: "imagen", recurso: "https://cdn.akamai.steamstatic.com/steam/apps/1716740/ss_5d63d1c9b44e2f46b4e2234dbb15a00a0c5b8a97.600x338.jpg" },
        { tipo: "imagen", recurso: "https://cdn.akamai.steamstatic.com/steam/apps/1716740/ss_af4d5de5695bd7b6b1b7f8a7a2a9a7a5e5d5c5b5.600x338.jpg" }
      ]
    },

    // Juegos de Valve/Gabe Newell
    {
      titulo: "Half-Life: Alyx",
      slug: "half-life-alyx",
      precio: 45.99,
      descripcion: "El regreso de Half-Life en realidad virtual. Ambientado entre Half-Life y Half-Life 2.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/546560/header.jpg",
      descarga: "https://store.steampowered.com/app/546560/HalfLife_Alyx/",
      autorId: devs[3].id,
      categorias: ["FPS", "VR", "Sci-Fi", "Shooter"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/ss_4887dc140a637684ddcfca518458668409f946dc.1920x1080.jpg?t=1749757928" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/ss_b2821283cb140cd5a6289a8160016b6a60d8f96e.1920x1080.jpg?t=1749757928" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/ss_68f15d580bf91971f637be5e464bc803482d78f7.1920x1080.jpg?t=1749757928" },
      ]
    },
    {
      titulo: "Portal 2",
      slug: "portal-2",
      precio: 9.99,
      descripcion: "El galardonado juego de puzzles con portales que desafía la física.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/620/header.jpg",
      descarga: "https://store.steampowered.com/app/620/Portal_2/",
      autorId: devs[3].id,
      categorias: ["Puzzle", "Plataformas", "Sci-Fi", "Comedia"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/620/ss_f3f6787d74739d3b2ec8a484b5c994b3d31ef325.1920x1080.jpg?t=1745363004" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/620/ss_6a4f5afdaa98402de9cf0b59fed27bab3256a6f4.1920x1080.jpg?t=1745363004" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/620/ss_0cdd90fafc160b52d08b303d205f9fd4e83cf164.1920x1080.jpg?t=1745363004" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/620/ss_3d13161104a04603a0524536770c5f74626db4c0.1920x1080.jpg?t=1745363004" },
      ]
    },

    // Juegos de FromSoftware/Miyazaki
    {
      titulo: "Elden Ring",
      slug: "elden-ring",
      precio: 59.99,
      descripcion: "Un juego de rol de acción en un mundo fantástico creado por Hidetaka Miyazaki y George R. R. Martin.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
      descarga: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
      autorId: devs[4].id,
      categorias: ["RPG", "Mundo Abierto", "Fantasía", "Acción"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_943bf6fe62352757d9070c1d33e50b92fe8539f1.1920x1080.jpg?t=1748630546" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_dcdac9e4b26ac0ee5248bfd2967d764fd00cdb42.1920x1080.jpg?t=1748630546" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_3c41384a24d86dddd58a8f61db77f9dc0bfda8b5.1920x1080.jpg?t=1748630546" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_e0316c76f8197405c1312d072b84331dd735d60b.1920x1080.jpg?t=1748630546" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_ef61b771ee6b269b1f0cb484233e07a0bfb5f81b.1920x1080.jpg?t=1748630546" },
      ]
    },
    {
      titulo: "Dark Souls III",
      slug: "dark-souls-3",
      precio: 39.99,
      descripcion: "Enfréntate a los desafíos definitivos en el último capítulo de la saga Dark Souls.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/header.jpg",
      descarga: "https://store.steampowered.com/app/374320/Dark_Souls_III/",
      autorId: devs[4].id,
      categorias: ["RPG", "Acción", "Fantasía", "Difícil"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/ss_5efd318b85a3917d1c6e717f4cb813b47547cd6f.1920x1080.jpg?t=1748630784" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/ss_1c0fa39091901496d77cf4cecfea4ffb056d6452.1920x1080.jpg?t=1748630784" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/ss_1318a04ef11d87f38aebe6d47a96124f8f888ca8.1920x1080.jpg?t=1748630784" },
      ]
    },

    // Juegos de Naughty Dog/Neil Druckmann
    {
      titulo: "The Last of Us Part I",
      slug: "the-last-of-us-part-1",
      precio: 59.99,
      descripcion: "Experimenta la emotiva historia de Joel y Ellie en esta remake fiel del clásico de Naughty Dog.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg",
      descarga: "https://store.steampowered.com/app/1888930/The_Last_of_Us_Part_I/",
      autorId: devs[5].id,
      categorias: ["Acción", "Aventura", "Horror", "Survival"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/ss_3f1805ecddafacee7f61f87cb8e4624435a83ee3.1920x1080.jpg?t=1750959031" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/ss_89fffc2857dcae29dee2a09f1be33d745610e19d.1920x1080.jpg?t=1750959031" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/ss_8cd55ab975b2e47f4d4d9a0da4ae6948040ef807.1920x1080.jpg?t=1750959031" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/ss_f4829000d3677a9b5b2f234482a7deff12b31ac9.1920x1080.jpg?t=1750959031" },
      ]
    },
    {
      titulo: "Uncharted: Legacy of Thieves Collection",
      slug: "uncharted-legacy-thieves",
      precio: 49.99,
      descripcion: "Vive las aventuras épicas de Nathan Drake y Chloe Frazer en esta colección remasterizada.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659420/header.jpg",
      descarga: "https://store.steampowered.com/app/1659420/Uncharted_Legacy_of_Thieves_Collection/",
      autorId: devs[5].id,
      categorias: ["Aventura", "Acción", "Plataformas", "Shooter"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659420/ss_417913fbee123c5e35718ebef63bc8a6ce435adf.1920x1080.jpg?t=1751913411" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659420/ss_a1816dd536122dd740043c2b9440136503904215.1920x1080.jpg?t=1751913411" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659420/ss_e570e5f369ff6cd0471f80d99f5a86c3b03a2285.1920x1080.jpg?t=1751913411" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659420/ss_b171bf276c5f6edb99ca96be0912b64b9136c2ad.1920x1080.jpg?t=1751913411" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659420/ss_af9770abac008e4b94565082f4312c51488d3c90.1920x1080.jpg?t=1751913411" },
      ]
    },

    // Juegos adicionales populares
    {
      titulo: "Cyberpunk 2077: Phantom Liberty",
      slug: "cyberpunk-phantom-liberty",
      precio: 49.99,
      descripcion: "Expansión espía de acción de Cyberpunk 2077 con Keanu Reeves e Idris Elba.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2138330/header.jpg",
      descarga: "https://store.steampowered.com/app/2138330/Cyberpunk_2077_Phantom_Liberty/",
      autorId: devs[2].id,
      categorias: ["RPG", "Sci-Fi", "Mundo Abierto", "Shooter"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_2f649b68d579bf87011487d29bc4ccbfdd97d34f.1920x1080.jpg?t=1756209867" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_0e64170751e1ae20ff8fdb7001a8892fd48260e7.1920x1080.jpg?t=1756209867" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_af2804aa4bf35d4251043744412ce3b359a125ef.1920x1080.jpg?t=1756209867" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_7924f64b6e5d586a80418c9896a1c92881a7905b.1920x1080.jpg?t=1756209867" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_4eb068b1cf52c91b57157b84bed18a186ed7714b.1920x1080.jpg?t=1756209867" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_8640d9db74f7cad714f6ecfb0e1aceaa3f887e58.1920x1080.jpg?t=1756209867" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_4bda6f67580d94832ed2d5814e41ebe018ba1d9e.1920x1080.jpg?t=1756209867" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_e5a94665dbfa5a30931cff2f45cdc0ebea9fcebb.1920x1080.jpg?t=1756209867" },
      ]
    },
    {
      titulo: "Baldur's Gate 3",
      slug: "baldurs-gate-3",
      precio: 59.99,
      descripcion: "RPG épico de Larian Studios basado en Dungeons & Dragons.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
      descarga: "https://store.steampowered.com/app/1086940/Baldurs_Gate_3/",
      autorId: devs[0].id,
      categorias: ["RPG", "Fantasía", "Táctico", "Mundo Abierto"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_c73bc54415178c07fef85f54ee26621728c77504.1920x1080.jpg?t=1759825106" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_73d93bea842b93914d966622104dcb8c0f42972b.1920x1080.jpg?t=1759825106" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_cf936d31061b58e98e0c646aee00e6030c410cda.1920x1080.jpg?t=1759825106" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_b6a6ee6e046426d08ceea7a4506a1b5f44181543.1920x1080.jpg?t=1759825106" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_6b8faba0f6831a406ce015648958da9612d14dbb.1920x1080.jpg?t=1759825106" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_8fc5eba770b4a1639b31666908bdd2bbc1aa2ae4.1920x1080.jpg?t=1759825106" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_31c13d137706fb4d9a4210513274a3ed9c3c7c96.1920x1080.jpg?t=1759825106" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_44d30da9c3e4622b46f2978e89bda0515856eaf4.1920x1080.jpg?t=1759825106" },
      ]
    },
    {
      titulo: "Red Dead Redemption 2",
      slug: "red-dead-redemption-2",
      precio: 59.99,
      descripcion: "Epica historia del Oeste americano de Rockstar Games.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
      descarga: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
      autorId: devs[2].id,
      categorias: ["Mundo Abierto", "Acción", "Aventura", "Shooter"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/ss_66b553f4c209476d3e4ce25fa4714002cc914c4f.1920x1080.jpg?t=1759502961" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/ss_bac60bacbf5da8945103648c08d27d5e202444ca.1920x1080.jpg?t=1759502961" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/ss_668dafe477743f8b50b818d5bbfcec669e9ba93e.1920x1080.jpg?t=1759502961" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/ss_4ce07ae360b166f0f650e9a895a3b4b7bf15e34f.1920x1080.jpg?t=1759502961" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/ss_d1a8f5a69155c3186c65d1da90491fcfd43663d9.1920x1080.jpg?t=1759502961" },
      ]
    },
    {
      titulo: "God of War Ragnarök",
      slug: "god-of-war-ragnarok",
      precio: 69.99,
      descripcion: "Kratos y Atreus se aventuran en los Nueve Reinos en busca de respuestas.",
      banner: "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png",
      descarga: "https://www.playstation.com/en-us/games/god-of-war-ragnarok/",
      autorId: devs[5].id,
      categorias: ["Acción", "Aventura", "Fantasía", "Hack and Slash"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_7c59382e67eadf779e0e15c3837ee91158237f11.1920x1080.jpg?t=1750909504" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_05f27139b15c5410d07cd59b7b52adbdf73e13da.1920x1080.jpg?t=1750909504" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_974a7b998c0c14da7fe52a342cf36c98850a57ac.1920x1080.jpg?t=1750909504" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_78350297511e81f287b4bc361935efbc3016f6db.1920x1080.jpg?t=1750909504" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_7cbcd6847cac4d2d42f496954d0df715c6af0b3a.1920x1080.jpg?t=1750909504" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_c6240e5611e6aa1c2219dbf778f79b2b5244d912.1920x1080.jpg?t=1750909504" },
      ]
    },
    {
      titulo: "SEX with HITLER",
      slug: "sex-with-hitler",
      precio: 69.99,
      descripcion: "Sex With Hitler is a unique blend of visual novel and top-down shooter.You will fight in the fields of World War II and meet five unique heroines, among whom you will find both friends and enemies.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1849000/header.jpg",
      descarga: "https://store.steampowered.com/app/1849000/SEX_with_HITLER/",
      autorId: devs[6].id,
      categorias: ["Acción", "Aventura", "Fantasía", "Hack and Slash"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1849000/ss_52001685eadf2cf6efe6c0b8c33c657a30cccf75.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1849000/ss_49d71a7473d292288ce92aa5251b469533c989fd.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1849000/ss_57bc55f0a992b66336cd8f298b707d0602fafdcb.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1849000/ss_d00346b71cf9f61b3da799dd64a13692eb482638.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1849000/ss_80ea3211f9445305512d9fd457d1474a5cc20962.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1849000/ss_664747310e142aee46e2d0512ba63761d01c7790.jpg" },
        // { tipo: "imagen", recurso: "" },
      ]
    },
    {
      titulo: "SEX with HITLER 2",
      slug: "sex-with-hitler-2",
      precio: 69.99,
      descripcion: "Sex With Hitler is a unique blend of visual novel and top-down shooter.You will fight in the fields of World War II and meet five unique heroines, among whom you will find both friends and enemies.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2194810/header.jpg",
      descarga: "https://store.steampowered.com/app/2194810/?curator_clanid=4777282&utm_source=SteamDB",
      autorId: devs[6].id,
      categorias: ["Acción", "Aventura", "Fantasía", "Hack and Slash"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2194810/ss_b04b4ae473a7017579f05eeb5927cb43c976ce12.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2194810/ss_bb1e9b190ef2e1d1b785b3db6c73bb9fb095e131.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2194810/ss_fc3e2b46c525eba8cbdb87579e9b088b7643d240.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2194810/ss_2ae334d59a9cbc707ad4366debd47cb7e4f4f8f5.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2194810/ss_98aaa9e743b8641b0d0214acc11777a13545a6fb.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2194810/ss_e9d68173b314fb4b57cbabb4a5933363746af205.jpg" },
      ]
    },
    {
      titulo: "KoboldKare",
      slug: "KoboldKare",
      precio: 69.99,
      descripcion: "KoboldKare is a multiplayer farming simulator, but instead of making produce you're making naked Kobolds! It's an FPS where there is bhopping, surfing, trimping, and also sex.",
      banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1102930/header.jpg",
      descarga: "https://store.steampowered.com/app/2194810/?curator_clanid=4777282&utm_source=SteamDB",
      autorId: devs[7].id,
      categorias: ["Acción", "Aventura", "Fantasía", "Hack and Slash"],
      recursos: [
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1102930/ss_b7fbbd298a5df353e80881aa71754e58c56c1aef.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1102930/ss_a1a7e00ec0d72e98d7d3f0df6bb27e3db6cd3ff3.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1102930/ss_70fcbc9c856cc7a320a989b8fd1399c289f42fdc.jpg" },
        { tipo: "imagen", recurso: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2194810/ss_2ae334d59a9cbc707ad4366debd47cb7e4f4f8f5.jpg" },
      ]
    }
  ];

  // Crear juegos y asignar categorías y recursos
  for (let juego of juegosData) {
    const categoriasJuego = categorias.filter(c => juego.categorias.includes(c.nombre));
    const nuevoJuego = await prisma.juego.create({
      data: {
        titulo: juego.titulo,
        slug: juego.slug,
        precio: juego.precio,
        descripcion: juego.descripcion,
        banner: juego.banner,
        descarga: juego.descarga,
        autorId: juego.autorId,
        categorias: { connect: categoriasJuego.map(c => ({ id: c.id })) }
      }
    });

    // Crear recursos para el juego
    for (let r of juego.recursos) {
      await prisma.recurso.create({
        data: {
          tipo: r.tipo,
          recurso: r.recurso,
          juegoId: nuevoJuego.id
        }
      });
    }

    if (nuevoJuego.titulo === "KoboldKare") {
      await prisma.juego.update({
        where: { id: nuevoJuego.id },
        data: { usuarios: { connect: { id: (await prisma.usuario.findUnique({ where: { nombre: "Mauricio Lopez" }, select: { id: true } })).id } } }
      });
    }

    if (nuevoJuego.titulo === "SEX with HITLER" || nuevoJuego.titulo === "SEX with HITLER 2") {
      await prisma.juego.update({
        where: { id: nuevoJuego.id },
        data: { usuarios: { connect: { id: (await prisma.usuario.findUnique({ where: { nombre: "Yei Axel Ridgnay Cardozo" }, select: { id: true } })).id } } }
      });
    }

    // await prisma.juego.update({
    //   where: { id: nuevoJuego.id },
    //   data: { usuarios: { connect: usuariosAleatorios.map(u => ({ id: u.id })) } }
    // });
  }

  console.log("Seed masivo completado! Se crearon:");
  console.log(`- ${categorias.length} categorías`);
  console.log(`- ${usuarios.length} usuarios normales`);
  console.log(`- ${devs.length} desarrolladores`);
  console.log(`- ${juegosData.length} juegos con recursos reales`);
}

main()
  .catch(e => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });