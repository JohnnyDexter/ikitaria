export type Lang = "ja" | "it" | "en";

export const langs: Lang[] = ["ja", "it", "en"];

export const langLabels: Record<Lang, string> = {
  ja: "日本語",
  it: "Italiano",
  en: "English",
};

export const langPaths: Record<Lang, string> = {
  ja: "/ja/",
  it: "/it/",
  en: "/en/",
};

export interface ProductItem {
  name: string;
  category: string;
  description: string;
  /** Percorso dell'immagine in public/, es. "/images/04-olive-valeri.jpg". Se assente, la card mostra un placeholder. */
  image?: string;
  /** Alt text descrittivo della foto prodotto (assente se `image` è assente). */
  imageAlt?: string;
}

export interface PageMeta {
  title: string;
  description: string;
}

export interface SiteContent {
  htmlLang: string;
  /** Title/description per pagina, distinti per una SEO corretta (niente duplicati). */
  meta: {
    home: PageMeta;
    shop: PageMeta;
    gallery: PageMeta;
  };
  /** Link "Salta al contenuto", visibile solo al focus da tastiera. */
  skipToContent: string;
  nav: {
    home: string;
    shop: string;
    gallery: string;
  };
  hero: {
    title: string;
    subtitle: string;
    text: string;
    ctaPrimary: string;
  };
  gallery: {
    kicker: string;
    title: string;
    intro: string;
    items: { image: string; alt: string }[];
  };
  categories: {
    kicker: string;
    title: string;
    /** CTA generica, usata fuori dalla griglia (es. in fondo alla pagina Chi siamo). */
    ctaLabel: string;
    items: {
      title: string;
      image?: string;
      imageAlt?: string;
      ctaLabel: string;
    }[];
  };
  italyJapan: {
    title: string;
    text: string;
    ctaLabel: string;
    imageAltItaly: string;
    imageAltJapan: string;
  };
  newsletter: {
    title: string;
    text: string;
    placeholder: string;
    ctaLabel: string;
    disabledNote: string;
    imageAlt: string;
  };
  storia: {
    kicker: string;
    title: string;
    paragraphs: string[];
    imageAlt: string;
    foundersCaption: string;
    foundersImageAlt: string;
    behindScenesKicker: string;
    /** Nota onesta: il negozio è ancora in allestimento, non va presentato come finito. */
    behindScenesNote: string;
    behindScenesImages: { src: string; alt: string }[];
  };
  prodotti: {
    kicker: string;
    title: string;
    intro: string;
    items: ProductItem[];
  };
  contatti: {
    kicker: string;
    title: string;
    shopName: string;
    addressLabel: string;
    addressLines: string[];
    accessLabel: string;
    accessTrain: string;
    accessParking: string;
    emailLabel: string;
    email: string;
    hoursLabel: string;
    hoursValue: string;
    socialLabel: string;
    socialValue: string;
    note: string;
    /** Alt text della mappa ufficiale del complesso Tsukimidai. */
    imageAlt: string;
    /** Credito discreto per la mappa, concessa dal complesso Tsukimidai. */
    mapCredit: string;
  };
  footer: {
    tagline: string;
    rights: string;
    languagesLabel: string;
    paymentsLabel: string;
    /** Testo prima del link "IKITARIA" nel credito di fondo pagina. */
    creditPrefix: string;
    /** Testo dopo il link "IKITARIA" (può essere vuoto). */
    creditSuffix: string;
  };
  /** Etichetta breve usata come kicker nelle pagine ancora scheletriche. */
  comingSoonLabel: string;
}

export const content: Record<Lang, SiteContent> = {
  ja: {
    htmlLang: "ja",
    meta: {
      home: {
        title: "ALMANACCO（アルマナッコ）— 横須賀のイタリア食材店 | IKITARIA",
        description:
          "ALMANACCOは、スペインとイタリアのワイン、マルケ州のオリーブオイル、工芸品、季節の物語を届ける、横須賀のイタリア食材店です。",
      },
      shop: {
        title: "商品 | ALMANACCO — 横須賀のイタリア食材店",
        description:
          "マルケ州の自社畑と、スペイン・イタリアの提携生産者から届く、エキストラバージンオリーブオイル、ワイン、パスタ。横須賀のALMANACCOで販売中です。",
      },
      gallery: {
        title: "ギャラリー | ALMANACCO — 横須賀のイタリア食材店",
        description:
          "マルケ州の畑やカンティーナ、横須賀の店の様子など、ALMANACCOにまつわる写真のギャラリーです。",
      },
    },
    skipToContent: "本文へスキップ",
    nav: {
      home: "ホーム",
      shop: "ショップ",
      gallery: "ギャラリー",
    },
    hero: {
      title: "Almanacco",
      subtitle: "イタリアから、季節とともに。",
      text: "横須賀にあるイタリアの小さな店。自社の畑や提携生産者が手がける、スペインとイタリアのワインとオリーブオイル。",
      ctaPrimary: "お店を見る",
    },
    gallery: {
      kicker: "写真で見る",
      title: "ギャラリー",
      intro:
        "マルケ州の畑やカンティーナ、横須賀の店の様子など、Almanaccoにまつわる風景です。",
      items: [
        {
          image: "/images/hero-map-motif.jpg",
          alt: "イタリアと日本を描いた地図モチーフのイラスト",
        },
        {
          image: "/images/marche/vigna-filari.jpg",
          alt: "マルケ州、ぶどう畑の間を通る未舗装の道",
        },
        {
          image: "/images/05-botti-murola.jpg",
          alt: "カンティーナ・ムローラの樫樽",
        },
        {
          image: "/images/04-olive-valeri.jpg",
          alt: "搾油前の摘みたてオリーブ",
        },
        { image: "/images/fuji-kawaguchiko.jpg", alt: "河口湖から望む富士山" },
      ],
    },
    categories: {
      kicker: "畑から店先へ",
      title: "カテゴリー",
      ctaLabel: "セレクションを見る",
      items: [
        {
          title: "ワイン＆飲料",
          image: "/images/05-botti-murola.jpg",
          imageAlt: "カンティーナの木樽と、田園へ続く入り口",
          ctaLabel: "カンティーナをのぞく",
        },
        {
          title: "オイル＆調味料",
          image: "/images/04-olive-valeri.jpg",
          imageAlt: "搾油前の摘みたてオリーブ",
          ctaLabel: "オイルを見る",
        },
      ],
    },
    italyJapan: {
      title: "ふたつの国、ひとつの暮らし方。",
      text: "マルケの丘から横須賀の街角まで。時間との向き合い方を教えてくれる産品や物語、日々の所作を集めています。",
      ctaLabel: "私たちについて",
      imageAltItaly: "マルケ州、ぶどう畑の間を通る未舗装の道",
      imageAltJapan: "河口湖から望む富士山",
    },
    newsletter: {
      title: "季節は移ろい、物語は続く。",
      text: "店からのお知らせ、新着入荷、生産者やイベントの情報。",
      placeholder: "メールアドレス",
      ctaLabel: "登録する",
      disabledNote: "登録機能は近日公開です",
      imageAlt: "夕暮れのマルケのひまわり畑",
    },
    storia: {
      kicker: "なぜ「アルマナッコ」なのか",
      title: "物語",
      paragraphs: [
        "アルマナッコ（almanacco）とは、イタリアの農村で昔から使われてきた「暦」のこと。種をまく日、収穫の時期、村の祭りの予定までもが、一冊の暦に書き込まれていました。マルケ州の農家にとって、それは単なるカレンダーではなく、土地と共に生きるための知恵の記録でした。",
        "私たちの店の名前を「Almanacco」としたのは、この暦が教えてくれる知恵——季節を見失わずに生きること——を大切にしたかったからです。横須賀で暮らす私たちが、マルケ州の畑で摘まれたオリーブとぶどうを、季節の言葉とともにお届けする。それが、この小さな店の役目だと思っています。",
      ],
      imageAlt: "マルケ州の丘陵地帯を望む風景",
      foundersCaption: "共同創業者のジョバンニとイクヤ",
      foundersImageAlt: "マルケ州イエージ駅にて、ジョバンニとイクヤ",
      behindScenesKicker: "舞台裏",
      behindScenesNote:
        "Almanaccoの店舗は現在準備中です。この写真は工事中の様子で、完成した店内ではありません。",
      behindScenesImages: [
        {
          src: "/images/about/cantiere-gazebo.jpg",
          alt: "店舗の内装工事中、屋外の作業スペースとタープ、道具類",
        },
        {
          src: "/images/about/cantiere-notte.jpg",
          alt: "夜、建設中の店舗の木造フレーム",
        },
        {
          src: "/images/about/cantiere-macchina-caffe.jpg",
          alt: "工事中の店内。エスプレッソマシンはすでに設置されている",
        },
        {
          src: "/images/about/cantiere-scaffale.jpg",
          alt: "まだ準備中の店内にある木製の棚とスツール",
        },
      ],
    },
    prodotti: {
      kicker: "畑から棚へ",
      title: "商品",
      intro:
        "マルケ州の生産者から届く、オリーブオイル、ワイン、パスタ。大量生産ではなく、家族や小さな生産者が丁寧に作るものだけを選んでいます。",
      items: [
        {
          name: "Frantoio Valeri",
          category: "エキストラバージンオリーブオイル",
          description:
            "マルケ州の在来品種「ミニョーラ（Mignola）」から搾られたエキストラバージンオリーブオイル。青々とした香りとほのかな辛みが特徴で、収穫からすぐに搾油する昔ながらの製法を守っています。",
          image: "/images/04-olive-valeri.jpg",
          imageAlt: "Frantoio Valeriのオイル用に摘みたての黒と緑のオリーブ",
        },
        {
          name: "Cantina Murola",
          category: "ワイン",
          description:
            "マルケ州の小さな家族経営ワイナリー、ムローラ醸造所のワイン。畑仕事から瓶詰めまで家族の手で行われ、土地の個性をそのまま映した味わいです。",
          image: "/images/05-botti-murola.jpg",
          imageAlt: "カンティーナ・ムローラの樫樽",
        },
        {
          name: "Colmone della Marca",
          category: "ワイン",
          description:
            "ファットリア・コルモーネが手がけるワイン「Colmone della Marca」。マルケの丘陵地帯らしい、果実味と穏やかな酸のバランスが持ち味です。",
          image: "/images/marche/bottiglie-tappi.jpg",
          imageAlt: "上から見たワインボトル、色とりどりのキャップシール",
        },
        {
          name: "Pasta Mancini",
          category: "パスタ",
          description:
            "マルケ州の職人的パスタ工房マンチーニ。ブロンズダイスによる押し出し成形と、低温でじっくり時間をかけた乾燥が特徴で、小麦本来の香りをそのまま生かしています。",
          image: "/images/marche/mietitrebbia-mancini.jpg",
          imageAlt: "マルケ州の小麦畑で働くコンバイン",
        },
      ],
    },
    contatti: {
      kicker: "お店へ",
      title: "アクセス",
      shopName: "Almanacco",
      addressLabel: "住所",
      addressLines: [
        "〒237-0075",
        "神奈川県横須賀市田浦町1-54",
        "月見台住宅 A29",
      ],
      accessLabel: "来店方法",
      accessTrain: "電車：JR田浦駅から徒歩約15分",
      accessParking:
        "お車：専用駐車場はございません。近隣のコインパーキングをご利用ください。",
      emailLabel: "メール",
      email: "info@ikitaria.com",
      hoursLabel: "営業時間",
      hoursValue: "近日公開予定",
      socialLabel: "SNS",
      socialValue: "近日公開予定",
      note: "営業時間・SNSアカウントは現在準備中です。決まり次第、こちらに掲載いたします。",
      imageAlt:
        "月見台複合施設の案内マップ。Almanacco（A29）の位置を含む区画一覧",
      mapCredit: "マップ提供：月見台",
    },
    footer: {
      tagline: "マルケの畑から、横須賀の暦へ。",
      rights: "All rights reserved.",
      languagesLabel: "言語",
      paymentsLabel: "お支払い方法（近日対応）",
      creditPrefix: "Almanacco は ",
      creditSuffix: " のプロジェクトです",
    },
    comingSoonLabel: "近日公開",
  },
  it: {
    htmlLang: "it",
    meta: {
      home: {
        title: "ALMANACCO — Bottega italiana a Yokosuka | IKITARIA",
        description:
          "ALMANACCO è una bottega italiana a Yokosuka dedicata a vini di Spagna e Italia, olio delle Marche, artigianato e storie di stagione.",
      },
      shop: {
        title: "Prodotti | ALMANACCO — Bottega italiana a Yokosuka",
        description:
          "Olio extravergine dal nostro uliveto nelle Marche, vino e pasta dai nostri produttori partner tra Spagna e Italia, in vendita nella bottega ALMANACCO a Yokosuka.",
      },
      gallery: {
        title: "Galleria | ALMANACCO — Bottega italiana a Yokosuka",
        description:
          "I campi e le cantine delle Marche, la bottega di Yokosuka: una galleria di immagini legate ad ALMANACCO.",
      },
    },
    skipToContent: "Vai al contenuto",
    nav: {
      home: "Home",
      shop: "Shop",
      gallery: "Galleria",
    },
    hero: {
      title: "Almanacco",
      subtitle: "Dall'Italia, attraverso le stagioni.",
      text: "Una bottega italiana a Yokosuka: vini e olio dai nostri vigneti e da produttori partner, tra Spagna e Italia.",
      ctaPrimary: "Scopri la bottega",
    },
    gallery: {
      kicker: "In immagini",
      title: "Galleria",
      intro:
        "I campi e le cantine delle Marche, la bottega di Yokosuka: paesaggi legati ad Almanacco.",
      items: [
        {
          image: "/images/hero-map-motif.jpg",
          alt: "Illustrazione di una mappa d'epoca con Italia e Giappone",
        },
        {
          image: "/images/marche/vigna-filari.jpg",
          alt: "Una strada sterrata tra i filari di vigna delle Marche",
        },
        {
          image: "/images/05-botti-murola.jpg",
          alt: "Botti di rovere nella cantina Murola",
        },
        {
          image: "/images/04-olive-valeri.jpg",
          alt: "Olive appena raccolte pronte per la spremitura",
        },
        {
          image: "/images/fuji-kawaguchiko.jpg",
          alt: "Il Monte Fuji visto dal lago Kawaguchiko",
        },
      ],
    },
    categories: {
      kicker: "Dal campo alla bottega",
      title: "Le nostre categorie",
      ctaLabel: "Scopri la selezione",
      items: [
        {
          title: "Vini & Bevande",
          image: "/images/05-botti-murola.jpg",
          imageAlt:
            "Botti di legno nella cantina, con la porta che si apre sulla campagna",
          ctaLabel: "Entra in cantina",
        },
        {
          title: "Olio & Condimenti",
          image: "/images/04-olive-valeri.jpg",
          imageAlt: "Olive appena raccolte pronte per la spremitura",
          ctaLabel: "Scopri gli oli",
        },
      ],
    },
    italyJapan: {
      title: "Due paesi. Un modo di vivere.",
      text: "Dalle colline delle Marche alle strade di Yokosuka, raccogliamo prodotti, storie e gesti che raccontano un modo diverso di vivere il tempo.",
      ctaLabel: "Scopri chi siamo",
      imageAltItaly: "Una strada sterrata tra i filari di vigna delle Marche",
      imageAltJapan: "Il Monte Fuji visto dal lago Kawaguchiko",
    },
    newsletter: {
      title: "Le stagioni cambiano. Le storie continuano.",
      text: "Novità dalla bottega, nuovi arrivi, produttori ed eventi.",
      placeholder: "La tua email",
      ctaLabel: "Iscriviti",
      disabledNote: "Iscrizione in arrivo",
      imageAlt: "Campo di girasoli delle Marche al tramonto",
    },
    storia: {
      kicker: "Perché si chiama Almanacco",
      title: "Storia",
      paragraphs: [
        "Nelle campagne italiane, l'almanacco era il libro dove si annotava tutto: il giorno buono per la semina, i tempi della raccolta, le feste del paese. Per i contadini delle Marche non era un semplice calendario, ma il modo in cui si teneva memoria del rapporto con la terra, stagione dopo stagione.",
        "Abbiamo chiamato questo negozio Almanacco per portare con noi questo modo di guardare il tempo: non perdere il filo delle stagioni. Da Yokosuka, portiamo l'olio e il vino raccolti nei campi delle Marche insieme al racconto delle stagioni che li hanno fatti nascere: è questo, in fondo, il senso di questa piccola bottega.",
      ],
      imageAlt: "Vista panoramica delle colline marchigiane",
      foundersCaption: "Giovanni e Ikuya, co-fondatori di IKITARIA",
      foundersImageAlt: "Giovanni e Ikuya alla stazione di Jesi, nelle Marche",
      behindScenesKicker: "Dietro le quinte",
      behindScenesNote:
        "Il negozio Almanacco è in fase di allestimento: queste foto raccontano il cantiere, non ancora il negozio finito.",
      behindScenesImages: [
        {
          src: "/images/about/cantiere-gazebo.jpg",
          alt: "Area di lavoro all'aperto durante l'allestimento del negozio, con gazebo e attrezzi",
        },
        {
          src: "/images/about/cantiere-notte.jpg",
          alt: "La struttura in legno del negozio in costruzione, di notte",
        },
        {
          src: "/images/about/cantiere-macchina-caffe.jpg",
          alt: "L'interno del negozio durante i lavori, con la macchina del caffè già installata",
        },
        {
          src: "/images/about/cantiere-scaffale.jpg",
          alt: "Scaffali e sgabelli in legno nel negozio ancora in allestimento",
        },
      ],
    },
    prodotti: {
      kicker: "Dal campo allo scaffale",
      title: "Prodotti",
      intro:
        "Selezioniamo olio, vino e pasta direttamente da piccoli produttori marchigiani, spesso a conduzione familiare, che lavorano lontano dalla grande distribuzione.",
      items: [
        {
          name: "Frantoio Valeri",
          category: "Olio extravergine d'oliva",
          description:
            "Olio extravergine spremuto dalla cultivar autoctona Mignola. Note erbacee decise e un finale leggermente piccante, frutto di una molitura rapida che segue ancora i tempi della raccolta.",
          image: "/images/04-olive-valeri.jpg",
          imageAlt:
            "Olive nere e verdi appena raccolte per l'olio Frantoio Valeri",
        },
        {
          name: "Cantina Murola",
          category: "Vino",
          description:
            "I vini della Cantina Murola, piccola realtà familiare marchigiana dove la vigna e la cantina sono ancora affari di famiglia, dalla potatura all'imbottigliamento.",
          image: "/images/05-botti-murola.jpg",
          imageAlt: "Botti di rovere nella cantina Murola",
        },
        {
          name: "Colmone della Marca",
          category: "Vino",
          description:
            "Il vino Colmone della Marca, firmato dalla Fattoria Colmone: frutto pieno e acidità equilibrata, l'impronta tipica delle colline marchigiane.",
          image: "/images/marche/bottiglie-tappi.jpg",
          imageAlt:
            "Bottiglie di vino viste dall'alto, con le capsule colorate",
        },
        {
          name: "Pasta Mancini",
          category: "Pasta",
          description:
            "Il pastificio artigianale Mancini, nelle Marche, noto per la trafilatura al bronzo e per un'essiccazione lenta a bassa temperatura, che preservano tutto il profumo del grano.",
          image: "/images/marche/mietitrebbia-mancini.jpg",
          imageAlt:
            "Una mietitrebbia al lavoro in un campo di grano nelle Marche",
        },
      ],
    },
    contatti: {
      kicker: "Vieni a trovarci",
      title: "Contatti",
      shopName: "Almanacco",
      addressLabel: "Indirizzo",
      addressLines: [
        "A29 Tsukimidai Jutaku",
        "1-54 Taura-cho, Yokosuka",
        "Kanagawa 237-0075, Giappone",
      ],
      accessLabel: "Come raggiungerci",
      accessTrain: "Treno: 15 minuti a piedi dalla stazione JR di Taura",
      accessParking:
        "Auto: non disponiamo di parcheggio proprio, consigliamo i parcheggi a pagamento nelle vicinanze.",
      emailLabel: "Email",
      email: "info@ikitaria.com",
      hoursLabel: "Orari",
      hoursValue: "In arrivo",
      socialLabel: "Social",
      socialValue: "In arrivo",
      note: "Orari di apertura e canali social sono ancora in definizione: saranno pubblicati qui appena disponibili.",
      imageAlt:
        "Mappa del complesso Tsukimidai, con la posizione di Almanacco (A29) tra le altre unità",
      mapCredit: "Mappa gentilmente concessa da Tsukimidai",
    },
    footer: {
      tagline: "Dai campi delle Marche all'almanacco di Yokosuka.",
      rights: "Tutti i diritti riservati.",
      languagesLabel: "Lingue",
      paymentsLabel: "Metodi di pagamento (in arrivo)",
      creditPrefix: "Almanacco è un progetto di ",
      creditSuffix: "",
    },
    comingSoonLabel: "In arrivo",
  },
  en: {
    htmlLang: "en",
    meta: {
      home: {
        title: "ALMANACCO — Italian Shop in Yokosuka | IKITARIA",
        description:
          "ALMANACCO is an Italian shop in Yokosuka devoted to wine from Spain and Italy, olive oil from the Marche, craft, and seasonal stories.",
      },
      shop: {
        title: "Products | ALMANACCO — Italian Shop in Yokosuka",
        description:
          "Extra virgin olive oil from our own grove in the Marche, wine and pasta from our partner producers across Spain and Italy, available at ALMANACCO in Yokosuka.",
      },
      gallery: {
        title: "Gallery | ALMANACCO — Italian Shop in Yokosuka",
        description:
          "Fields and cellars in the Marche, the Yokosuka shop: a gallery of images from ALMANACCO.",
      },
    },
    skipToContent: "Skip to content",
    nav: {
      home: "Home",
      shop: "Shop",
      gallery: "Gallery",
    },
    hero: {
      title: "Almanacco",
      subtitle: "From Italy, through the seasons.",
      text: "An Italian shop in Yokosuka: wines and olive oil from our own vineyards and partner producers, across Spain and Italy.",
      ctaPrimary: "Discover the shop",
    },
    gallery: {
      kicker: "In pictures",
      title: "Gallery",
      intro:
        "Fields and cellars in the Marche, the Yokosuka shop: scenes from Almanacco.",
      items: [
        {
          image: "/images/hero-map-motif.jpg",
          alt: "Illustration of a vintage map with Italy and Japan",
        },
        {
          image: "/images/marche/vigna-filari.jpg",
          alt: "A dirt road between rows of vines in the Marche",
        },
        {
          image: "/images/05-botti-murola.jpg",
          alt: "Oak barrels in the Cantina Murola cellar",
        },
        {
          image: "/images/04-olive-valeri.jpg",
          alt: "Freshly harvested olives ready for pressing",
        },
        {
          image: "/images/fuji-kawaguchiko.jpg",
          alt: "Mount Fuji seen from Lake Kawaguchiko",
        },
      ],
    },
    categories: {
      kicker: "From the field to the shop",
      title: "Our categories",
      ctaLabel: "Discover the selection",
      items: [
        {
          title: "Wine & Beverages",
          image: "/images/05-botti-murola.jpg",
          imageAlt:
            "Wooden barrels in the cellar, with the door opening onto the countryside",
          ctaLabel: "Step into the cellar",
        },
        {
          title: "Oil & Condiments",
          image: "/images/04-olive-valeri.jpg",
          imageAlt: "Freshly harvested olives ready for pressing",
          ctaLabel: "Discover the oils",
        },
      ],
    },
    italyJapan: {
      title: "Two countries. One way of living.",
      text: "From the hills of the Marche to the streets of Yokosuka, we gather products, stories, and gestures that speak of a different way to experience time.",
      ctaLabel: "Discover who we are",
      imageAltItaly: "A dirt road between rows of vines in the Marche",
      imageAltJapan: "Mount Fuji seen from Lake Kawaguchiko",
    },
    newsletter: {
      title: "The seasons change. The stories continue.",
      text: "News from the shop, new arrivals, producers, and events.",
      placeholder: "Your email",
      ctaLabel: "Subscribe",
      disabledNote: "Sign-up coming soon",
      imageAlt: "A sunflower field in the Marche at sunset",
    },
    storia: {
      kicker: "Why we're called Almanacco",
      title: "Story",
      paragraphs: [
        "In the Italian countryside, the almanacco (almanac) was the book where everything was written down: the right day for sowing, the time for harvest, the village festivals. For farming families in the Marche, it wasn't just a calendar — it was how the relationship with the land was remembered, season after season.",
        "We named this shop Almanacco to carry that same way of paying attention to time: never losing track of the seasons. From Yokosuka, we bring olive oil and wine harvested in the fields of the Marche, together with the story of the seasons that shaped them — that, in the end, is what this small shop is about.",
      ],
      imageAlt: "Panoramic view of the Marche hills",
      foundersCaption: "Giovanni and Ikuya, co-founders of IKITARIA",
      foundersImageAlt:
        "Giovanni and Ikuya at the Jesi train station, in the Marche",
      behindScenesKicker: "Behind the scenes",
      behindScenesNote:
        "The Almanacco shop is still being built: these photos show the work in progress, not the finished shop.",
      behindScenesImages: [
        {
          src: "/images/about/cantiere-gazebo.jpg",
          alt: "Outdoor work area during the shop's build-out, with a gazebo and tools",
        },
        {
          src: "/images/about/cantiere-notte.jpg",
          alt: "The shop's wooden frame under construction, at night",
        },
        {
          src: "/images/about/cantiere-macchina-caffe.jpg",
          alt: "Inside the shop during construction, with the espresso machine already installed",
        },
        {
          src: "/images/about/cantiere-scaffale.jpg",
          alt: "Wooden shelving and stools in the still-unfinished shop",
        },
      ],
    },
    prodotti: {
      kicker: "From the field to the shelf",
      title: "Products",
      intro:
        "We source olive oil, wine, and pasta directly from small producers in the Marche, often family-run, working outside the reach of large-scale distribution.",
      items: [
        {
          name: "Frantoio Valeri",
          category: "Extra virgin olive oil",
          description:
            "Extra virgin olive oil pressed from the native Mignola cultivar. Bold, grassy notes and a lightly peppery finish, the result of rapid milling that still follows the pace of the harvest.",
          image: "/images/04-olive-valeri.jpg",
          imageAlt:
            "Freshly harvested black and green olives for Frantoio Valeri oil",
        },
        {
          name: "Cantina Murola",
          category: "Wine",
          description:
            "Wines from Cantina Murola, a small family-run winery in the Marche where the vineyard and the cellar are still a family affair, from pruning to bottling.",
          image: "/images/05-botti-murola.jpg",
          imageAlt: "Oak barrels in the Cantina Murola cellar",
        },
        {
          name: "Colmone della Marca",
          category: "Wine",
          description:
            "Colmone della Marca, produced by Fattoria Colmone: full fruit and balanced acidity, the signature of the Marche hills.",
          image: "/images/marche/bottiglie-tappi.jpg",
          imageAlt: "Wine bottles seen from above, with colorful foil capsules",
        },
        {
          name: "Pasta Mancini",
          category: "Pasta",
          description:
            "Pasta from the Mancini workshop in the Marche, known for bronze-die extrusion and slow, low-temperature drying that preserve the full aroma of the wheat.",
          image: "/images/marche/mietitrebbia-mancini.jpg",
          imageAlt:
            "A combine harvester at work in a wheat field in the Marche",
        },
      ],
    },
    contatti: {
      kicker: "Come visit us",
      title: "Contact",
      shopName: "Almanacco",
      addressLabel: "Address",
      addressLines: [
        "A29 Tsukimidai Jutaku",
        "1-54 Taura-cho, Yokosuka",
        "Kanagawa 237-0075, Japan",
      ],
      accessLabel: "Getting here",
      accessTrain: "By train: 15-minute walk from JR Taura Station",
      accessParking:
        "By car: we don't have our own parking — nearby coin-operated parking lots are recommended.",
      emailLabel: "Email",
      email: "info@ikitaria.com",
      hoursLabel: "Hours",
      hoursValue: "Coming soon",
      socialLabel: "Social",
      socialValue: "Coming soon",
      note: "Opening hours and social channels are still being finalized and will be published here as soon as they're ready.",
      imageAlt:
        "Map of the Tsukimidai complex, showing Almanacco's location (A29) among the other units",
      mapCredit: "Map kindly provided by Tsukimidai",
    },
    footer: {
      tagline: "From the fields of the Marche to the Yokosuka almanac.",
      rights: "All rights reserved.",
      languagesLabel: "Languages",
      paymentsLabel: "Payment methods (coming soon)",
      creditPrefix: "Almanacco is a project by ",
      creditSuffix: "",
    },
    comingSoonLabel: "Coming soon",
  },
};
