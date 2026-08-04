/**
 * 職種別デモサイトの中身（18職種）。
 *
 * ⚠️ **クライアントコンポーネントからこのファイルを import しないこと。**
 *    18職種ぶんが初期JSに載ります。表示に必要な1職種はサーバー側から props で渡してください。
 *    型と小さな定数は `src/lib/showcase.ts` にあります（そちらはクライアントから読んで構いません）。
 *    例外は `/showcase/generate` で、全テンプレートとの照合が目的なので必要です。
 *
 * 職種を足すときは、この配列に1件足すだけで、一覧・sitemap・llms.txt・
 * チャットボットの知識・自動生成のテンプレートまで自動で追従します。
 */

import type { DemoSlug, IntegrationNode, Industry } from "@/lib/showcase";

const n = (key: string, label: string, icon: IntegrationNode["icon"]): IntegrationNode => ({
  key,
  label,
  icon,
});

export const industries: Industry[] = [
  {
    slug: "retail",
    name: "小売・EC",
    eyebrow: "Retail & EC",
    icon: "cart",
    tagline: "実物を確かめられない不安を、画面の中で解消する。",
    customer: "自社商品をネットでも売っている小売店・メーカー直販",
    challenges: [
      "写真だけでは質感やサイズが伝わらず、カートに入る前に離脱する",
      "問い合わせの多くが「在庫」「納期」「サイズ」の3つで、対応に人手を取られる",
      "在庫システムとサイトが別で、売り切れ商品の注文が入ってしまう",
    ],
    product: { name: "主力商品", note: "陶器・雑貨・家電など、質感が売りの商品を想定しています" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "cup",
    systems: [
      n("inventory", "在庫システム", "cart"),
      n("crm", "顧客管理（CRM）", "user"),
      n("notify", "スタッフへの通知", "chat"),
    ],
    catalog: [
      { sku: "RT-1001", name: "伏見焼 マグカップ", category: "食器", price: 3800, stock: 24, location: "本店倉庫" },
      { sku: "RT-1002", name: "宇治茶ギフトセット", category: "食品", price: 5400, stock: 8, location: "本店倉庫" },
      { sku: "RT-2001", name: "西陣織 ノートカバー", category: "文具", price: 7200, stock: 3, location: "第2倉庫" },
      { sku: "RT-2002", name: "清水焼 酒器セット", category: "食器", price: 12800, stock: 0, location: "第2倉庫" },
      { sku: "RT-3001", name: "京友禅 スカーフ", category: "衣料", price: 16500, stock: 11, location: "大阪倉庫" },
      { sku: "RT-3002", name: "桐箱入り 線香セット", category: "雑貨", price: 4200, stock: 42, location: "大阪倉庫" },
    ],
    picks: [
      {
        demo: "3dcg",
        title: "商品を回して、質感まで見てもらう",
        scene: "商品ページで写真の代わりに3Dモデルを置き、お客様が自分で回して底面やフタの内側まで確認できるようにします。",
        effect: "「思っていたものと違った」による返品と、サイズ・質感の問い合わせが減ります。",
      },
      {
        demo: "ar",
        title: "自宅に実物大で置いてみてもらう",
        scene: "スマートフォンのカメラごしに、実物大の商品を部屋に配置。棚に入るか、他の家具と合うかをその場で判断できます。",
        effect: "大型商品ほど効きます。購入前の不安がなくなり、カート放棄が減ります。",
      },
      {
        demo: "recommend",
        title: "見ている商品から次の一点を薦める",
        scene: "閲覧履歴と商品の特徴から、いま見ている商品と相性のよい商品を「なぜ薦めるのか」つきで表示します。",
        effect: "客単価（一度の購入金額）が上がります。理由を出すので押し売りに見えません。",
      },
      {
        demo: "integration",
        title: "在庫と注文を裏でつなぐ",
        scene: "注文が入ったら在庫システムに引き当て、顧客管理へ記録し、スタッフに通知するまでを自動で行います。失敗しても自動で再試行します。",
        effect: "在庫のずれによる欠品トラブルと、転記作業がなくなります。",
      },
    ],
    alsoUseful: ["ai-chatbot", "insight", "sns", "personalize"],
    outcomes: [
      { label: "問い合わせ対応", value: "定型質問の自動応答" },
      { label: "客単価", value: "関連商品の提示で上積み" },
      { label: "手作業", value: "在庫・顧客の転記をゼロに" },
    ],
  },

  {
    slug: "restaurant",
    name: "飲食店",
    eyebrow: "Restaurant",
    icon: "heart",
    tagline: "予約と来店動機を、サイトの中だけで完結させる。",
    customer: "個人店・小規模チェーンの飲食店、カフェ、居酒屋",
    challenges: [
      "予約の電話が営業中にかかってきて、その都度手が止まる",
      "外国人のお客様が増えたが、メニューの説明ができない",
      "SNSは更新しているのに、サイトが古いままで印象が合っていない",
    ],
    product: { name: "看板メニュー", note: "コース料理や名物料理を立体で見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "dish",
    systems: [
      n("inventory", "予約台帳", "clock"),
      n("crm", "POSレジ", "cart"),
      n("notify", "店舗への通知", "chat"),
    ],
    catalog: [
      { sku: "RS-1001", name: "おまかせコース（夜）", category: "コース", price: 8800, stock: 12, location: "本店" },
      { sku: "RS-1002", name: "季節の会席", category: "コース", price: 12000, stock: 6, location: "本店" },
      { sku: "RS-2001", name: "ランチ御膳", category: "ランチ", price: 1800, stock: 30, location: "本店" },
      { sku: "RS-2002", name: "個室（4名まで）", category: "席", price: 0, stock: 2, location: "2階" },
      { sku: "RS-3001", name: "誕生日ケーキ", category: "オプション", price: 3300, stock: 0, location: "要予約" },
      { sku: "RS-3002", name: "テイクアウト折詰", category: "物販", price: 4500, stock: 18, location: "本店" },
    ],
    picks: [
      {
        demo: "ai-chatbot",
        title: "営業中の電話を、チャットの予約に置き換える",
        scene: "「今週の金曜、4名で空いていますか」に答え、そのまま日程・時間・人数を確認して予約番号を発行するところまで会話で進めます。",
        effect: "営業中に手が止まりません。答えられない質問は電話へ案内するので、取りこぼしもありません。",
      },
      {
        demo: "multilingual",
        title: "メニューと案内を多言語で出す",
        scene: "訪問者の言語設定を見て日本語／英語を切り替え、価格も現地通貨の目安で表示します。アレルギー表示も同時に切り替わります。",
        effect: "インバウンド（訪日客）の予約が取りやすくなり、来店後の説明も減ります。",
      },
      {
        demo: "sns",
        title: "SNSの投稿をサイトに流し込む",
        scene: "日々の投稿をサイトのトップに自動で表示。共有されたときのカード（写真とタイトル）も整えます。",
        effect: "サイトの更新作業がなくなり、「最近やっているのか分からない」を解消できます。",
      },
      {
        demo: "voice",
        title: "手がふさがっていても操作できる",
        scene: "厨房や店頭で、話しかけて予約状況を確認したり、読み上げで確認したりできます。",
        effect: "スマートフォンを触れない場面でも、店の情報にアクセスできます。",
      },
    ],
    alsoUseful: ["animation", "personalize", "pwa", "insight"],
    outcomes: [
      { label: "電話対応", value: "定型の予約質問を自動化" },
      { label: "訪日客", value: "多言語で予約のハードルを下げる" },
      { label: "更新作業", value: "SNS連携で実質ゼロに" },
    ],
  },

  {
    slug: "clinic",
    name: "クリニック・歯科",
    eyebrow: "Clinic",
    icon: "shield",
    tagline: "受付の電話を減らし、初診の不安を先に取り除く。",
    customer: "内科・歯科・整形外科などの医院、動物病院",
    challenges: [
      "診療時間・休診日・持ち物の電話問い合わせが多く、受付が手一杯",
      "初めての方が「何をされるのか」が分からず、予約に踏み切れない",
      "予約システムとサイトが別で、患者さんが迷子になる",
    ],
    product: { name: "院内・設備", note: "診療室や機器を立体で見せて、来院前の不安を減らす想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "dental-unit",
    systems: [
      n("inventory", "予約システム", "clock"),
      n("crm", "電子カルテ連携", "user"),
      n("notify", "受付への通知", "bell"),
    ],
    catalog: [
      { sku: "CL-1001", name: "初診（一般診療）", category: "診療", price: 0, stock: 8, location: "第1診察室" },
      { sku: "CL-1002", name: "定期検診", category: "診療", price: 0, stock: 14, location: "第1診察室" },
      { sku: "CL-2001", name: "予防接種", category: "予防", price: 0, stock: 4, location: "処置室" },
      { sku: "CL-2002", name: "健康診断（企業）", category: "健診", price: 0, stock: 0, location: "健診室" },
      { sku: "CL-3001", name: "オンライン相談", category: "オンライン", price: 0, stock: 6, location: "オンライン" },
      { sku: "CL-3002", name: "土曜午前枠", category: "診療", price: 0, stock: 3, location: "第2診察室" },
    ],
    picks: [
      {
        demo: "ai-chatbot",
        title: "受付の定型質問を引き受ける",
        scene: "診療時間・休診日・持ち物・駐車場といった質問に、サイトに書いてある内容だけを根拠にして答えます。判断が要る質問には答えず、電話へ案内します。",
        effect: "受付の電話が減り、対面の対応に集中できます。医療は誤答が許されないため「答えない」設計が要です。",
      },
      {
        demo: "personalize",
        title: "初診の方と再診の方で見せ方を変える",
        scene: "初めての方には持ち物と流れを、再診の方には予約変更と診療時間を先に出します。",
        effect: "初診の不安が減り、予約完了までの離脱が減ります。",
      },
      {
        demo: "3dcg",
        title: "院内を立体で見せて、来院前の不安を減らす",
        scene: "診察室や機器を回して見られるようにします。歯科では治療内容の説明にも使えます。",
        effect: "「どんなところか分からない」という理由の離脱を防げます。",
      },
      {
        demo: "pwa",
        title: "予約のリマインドを通知で送る",
        scene: "ホーム画面に追加でき、予約前日に通知を出せます。通信が不安定でも診療時間は表示されます。",
        effect: "無断キャンセルが減り、電話でのリマインドが不要になります。",
      },
    ],
    alsoUseful: ["voice", "multilingual", "ai-agent", "insight"],
    outcomes: [
      { label: "受付の電話", value: "定型質問ぶんを削減" },
      { label: "無断キャンセル", value: "前日通知で抑制" },
      { label: "初診の離脱", value: "流れを先に見せて改善" },
    ],
  },

  {
    slug: "manufacturing",
    name: "製造業",
    eyebrow: "Manufacturing",
    icon: "cpu",
    tagline: "図面と仕様を、伝わる形にして商談を短くする。",
    customer: "部品・装置・機器のメーカー、加工業、OEM受託",
    challenges: [
      "製品の説明がPDFのカタログ頼みで、問い合わせ前に理解してもらえない",
      "見積もり依頼のたびに仕様を聞き直していて、初回返答に時間がかかる",
      "海外からの引き合いに対応したいが、英語の資料がない",
    ],
    product: { name: "自社製品・部品", note: "装置・部品・筐体など、形状そのものが仕様の商品を想定しています" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "machine-part",
    systems: [
      n("inventory", "生産管理（ERP）", "chart"),
      n("crm", "案件管理", "user"),
      n("notify", "営業への通知", "bell"),
    ],
    catalog: [
      { sku: "MF-1001", name: "アルミ切削筐体 A型", category: "筐体", price: 48000, stock: 32, location: "本社工場" },
      { sku: "MF-1002", name: "ステンレス架台", category: "架台", price: 126000, stock: 5, location: "本社工場" },
      { sku: "MF-2001", name: "制御基板ユニット", category: "電装", price: 89000, stock: 12, location: "第2工場" },
      { sku: "MF-2002", name: "防塵カバー（特注）", category: "カバー", price: 0, stock: 0, location: "受注生産" },
      { sku: "MF-3001", name: "センサーブラケット", category: "部品", price: 6800, stock: 240, location: "部品倉庫" },
      { sku: "MF-3002", name: "保守用パッキンセット", category: "保守", price: 3200, stock: 96, location: "部品倉庫" },
    ],
    picks: [
      {
        demo: "3dcg",
        title: "製品を回して、取り付け面まで見せる",
        scene: "PDFの図面ではなく、ブラウザ上で回せる3Dモデルを置きます。裏面の端子配置や取り付け穴の位置まで、その場で確認してもらえます。",
        effect: "「実物を見ないと分からない」で止まっていた商談が、初回の問い合わせ前に進みます。",
      },
      {
        demo: "simulator",
        title: "仕様を選ぶと概算が出る",
        scene: "材質・数量・表面処理・納期を選ぶと、概算金額と目安の納期をその場で出します。結果はそのまま問い合わせに引き継げます。",
        effect: "初回の見積もり返答が速くなり、条件の合わない引き合いに時間を使わずに済みます。",
      },
      {
        demo: "multilingual",
        title: "英語の技術資料を同じ内容で出す",
        scene: "言語だけでなく、単位・通貨・日付の書式も切り替えます。検索エンジンにも言語別のページとして正しく伝えます。",
        effect: "海外からの引き合いを、翻訳作業なしで受けられるようになります。",
      },
      {
        demo: "integration",
        title: "引き合いを生産管理へ流す",
        scene: "問い合わせが入ったら案件として登録し、生産管理から在庫と納期を引き当て、担当営業へ通知します。",
        effect: "転記のミスがなくなり、返答までの時間が短くなります。",
      },
    ],
    alsoUseful: ["configurator", "ai-agent", "ai-chatbot", "ar"],
    outcomes: [
      { label: "初回返答", value: "概算をその場で提示" },
      { label: "海外の引き合い", value: "多言語対応で受けられる" },
      { label: "商談の前倒し", value: "3Dで仕様を先に共有" },
    ],
  },

  {
    slug: "realestate",
    name: "不動産",
    eyebrow: "Real Estate",
    icon: "pin",
    tagline: "内見の前に、住んだときの想像をしてもらう。",
    customer: "売買・賃貸の仲介、リノベーション、投資用物件の販売",
    challenges: [
      "内見してみたら条件が違った、という無駄足が双方に発生している",
      "資金計画の相談が入口になりがちで、営業の負担が大きい",
      "問い合わせ客の温度感が分からず、追客の優先順位が付けられない",
    ],
    product: { name: "物件・間取り", note: "建物や部屋を立体で見せて、内見前に判断してもらう想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "floorplan",
    systems: [
      n("inventory", "物件データベース", "layout"),
      n("crm", "顧客管理（CRM）", "user"),
      n("notify", "担当者への通知", "bell"),
    ],
    catalog: [
      { sku: "RE-1001", name: "伏見区 3LDK 中古マンション", category: "売買", price: 32800000, stock: 1, location: "伏見区" },
      { sku: "RE-1002", name: "山科区 新築戸建", category: "売買", price: 41500000, stock: 2, location: "山科区" },
      { sku: "RE-2001", name: "四条烏丸 1K 賃貸", category: "賃貸", price: 78000, stock: 4, location: "中京区" },
      { sku: "RE-2002", name: "北大路 2DK 賃貸", category: "賃貸", price: 92000, stock: 0, location: "北区" },
      { sku: "RE-3001", name: "事業用テナント（1階）", category: "事業用", price: 240000, stock: 1, location: "下京区" },
      { sku: "RE-3002", name: "駐車場（月極）", category: "駐車場", price: 18000, stock: 12, location: "伏見区" },
    ],
    picks: [
      {
        demo: "3dcg",
        title: "間取りを立体で歩いてもらう",
        scene: "平面図では伝わらない天井高や窓の位置を、回して確かめられるようにします。家具を置いた状態も見せられます。",
        effect: "内見の無駄足が減り、来店したときには前提がそろっています。",
      },
      {
        demo: "simulator",
        title: "資金計画をその場で試算する",
        scene: "価格・頭金・金利・年数を入れると、月々の返済額と総額が即座に出ます。結果は問い合わせにそのまま添付できます。",
        effect: "「いくらになるか」の相談が入口にならず、営業は物件の話から始められます。",
      },
      {
        demo: "insight",
        title: "どの物件がどこまで見られたかを測る",
        scene: "ページ内のクリック位置をヒートマップで可視化し、見出しや写真の並びをA/Bテストで比較します。",
        effect: "反響の多い見せ方が数字で分かり、掲載の順番を根拠を持って決められます。",
      },
      {
        demo: "personalize",
        title: "希望条件に合わせて表示を変える",
        scene: "一度見た条件（エリア・間取り・価格帯）を覚えて、次の訪問では近い物件を先に見せます。",
        effect: "再訪問時の離脱が減り、追客の優先順位も判断しやすくなります。",
      },
    ],
    alsoUseful: ["ar", "ai-chatbot", "sns", "ai-agent"],
    outcomes: [
      { label: "内見の無駄足", value: "事前の情報量で削減" },
      { label: "資金相談", value: "その場で試算して自走化" },
      { label: "掲載の改善", value: "数値を見て判断" },
    ],
  },

  {
    slug: "construction",
    name: "建設・工務店",
    eyebrow: "Construction",
    icon: "layout",
    tagline: "完成イメージと概算を、最初の相談の前に渡す。",
    customer: "注文住宅・リフォーム・外構・内装の工事会社",
    challenges: [
      "相見積もりが前提で、初回の概算提示が遅いと候補から外れる",
      "完成イメージが伝わらず、打ち合わせの回数が増える",
      "問い合わせのほとんどが「いくらかかるか」で、その対応に追われる",
    ],
    product: { name: "施工イメージ", note: "住宅・内装・外構の完成形を立体で見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "house",
    systems: [
      n("inventory", "見積もりシステム", "calc"),
      n("crm", "工程管理", "clock"),
      n("notify", "現場担当への通知", "bell"),
    ],
    catalog: [
      { sku: "CN-1001", name: "キッチン交換（標準）", category: "水回り", price: 980000, stock: 6, location: "施工枠" },
      { sku: "CN-1002", name: "浴室リフォーム", category: "水回り", price: 1280000, stock: 3, location: "施工枠" },
      { sku: "CN-2001", name: "外壁塗装（30坪）", category: "外装", price: 1150000, stock: 2, location: "施工枠" },
      { sku: "CN-2002", name: "屋根葺き替え", category: "外装", price: 1850000, stock: 0, location: "施工枠" },
      { sku: "CN-3001", name: "内装クロス張替（1室）", category: "内装", price: 68000, stock: 14, location: "施工枠" },
      { sku: "CN-3002", name: "ウッドデッキ設置", category: "外構", price: 420000, stock: 4, location: "施工枠" },
    ],
    picks: [
      {
        demo: "simulator",
        title: "工事の概算をその場で出す",
        scene: "工事の種類・広さ・グレード・時期を選ぶと、概算金額と工期の目安が即座に出ます。内訳も表示するので納得感があります。",
        effect: "相見積もりの初動で先行できます。条件の合わない依頼を早い段階で見分けられます。",
      },
      {
        demo: "3dcg",
        title: "完成形を回して確認してもらう",
        scene: "施工後のイメージを立体で見せ、色や素材を切り替えて比較できるようにします。",
        effect: "打ち合わせの回数が減り、施工後の「イメージと違う」を防げます。",
      },
      {
        demo: "ar",
        title: "現地に実物大で置いてみる",
        scene: "スマートフォンのカメラで、ウッドデッキやカーポートを実際の敷地に実物大で重ねて確認します。",
        effect: "サイズ感の齟齬がなくなり、決定までが早くなります。",
      },
      {
        demo: "ai-chatbot",
        title: "対応エリアと工期の質問を引き受ける",
        scene: "対応エリア・工期・保証・補助金といった定型の質問に、サイトの記載を根拠にして答えます。",
        effect: "現場に出ている時間帯の取りこぼしが減ります。",
      },
    ],
    alsoUseful: ["configurator", "insight", "sns", "ai-agent"],
    outcomes: [
      { label: "初回提示", value: "概算をその場で" },
      { label: "打ち合わせ回数", value: "完成イメージの共有で削減" },
      { label: "取りこぼし", value: "時間外の問い合わせを受ける" },
    ],
  },

  {
    slug: "school",
    name: "学習塾・スクール",
    eyebrow: "School",
    icon: "award",
    tagline: "説明会に来る前に、合うかどうかを判断してもらう。",
    customer: "学習塾、予備校、資格スクール、習い事教室",
    challenges: [
      "料金体系が複雑で、問い合わせの大半が費用の確認になっている",
      "体験申し込みまでの導線が長く、途中で離脱される",
      "在籍生の保護者への連絡が電話とプリント頼み",
    ],
    product: { name: "教室・教材", note: "教室の雰囲気や教材を立体で見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "desk",
    systems: [
      n("inventory", "生徒管理", "user"),
      n("crm", "時間割・出欠", "clock"),
      n("notify", "保護者への通知", "bell"),
    ],
    catalog: [
      { sku: "SC-1001", name: "小学生コース（週2）", category: "通常", price: 18000, stock: 6, location: "本校" },
      { sku: "SC-1002", name: "中学生コース（週3）", category: "通常", price: 26000, stock: 2, location: "本校" },
      { sku: "SC-2001", name: "個別指導（60分×4）", category: "個別", price: 24000, stock: 4, location: "本校" },
      { sku: "SC-2002", name: "夏期講習（標準）", category: "講習", price: 48000, stock: 0, location: "本校" },
      { sku: "SC-3001", name: "オンライン受講", category: "オンライン", price: 15000, stock: 20, location: "オンライン" },
      { sku: "SC-3002", name: "無料体験授業", category: "体験", price: 0, stock: 8, location: "本校" },
    ],
    picks: [
      {
        demo: "simulator",
        title: "月謝の総額をその場で計算する",
        scene: "学年・コース・回数・講習の有無を選ぶと、月々と年間の総額が内訳つきで出ます。",
        effect: "費用の問い合わせが減り、「高そうだから聞くのをやめた」という離脱を防げます。",
      },
      {
        demo: "ai-chatbot",
        title: "体験申し込みまで会話で進める",
        scene: "対象学年・時間割・振替の可否などに答えたうえで、体験授業の日程を選んで申し込みまで進めます。",
        effect: "問い合わせフォームに比べて完了率が上がります。夜間の申し込みも取りこぼしません。",
      },
      {
        demo: "pwa",
        title: "保護者への連絡を通知で届ける",
        scene: "ホーム画面に追加してもらい、休講・時間変更・お知らせを通知で送ります。",
        effect: "電話連絡とプリント配布の手間がなくなり、伝達もれが減ります。",
      },
      {
        demo: "personalize",
        title: "学年に合わせて見せる内容を変える",
        scene: "一度選んだ学年を覚えて、次の訪問では該当コースと日程を先に表示します。",
        effect: "情報を探す手間がなくなり、体験申し込みまでが短くなります。",
      },
    ],
    alsoUseful: ["insight", "animation", "sns", "ai-agent"],
    outcomes: [
      { label: "費用の問い合わせ", value: "シミュレーターで自走化" },
      { label: "体験申し込み", value: "会話形式で完了率を上げる" },
      { label: "保護者連絡", value: "通知で確実に届ける" },
    ],
  },

  {
    slug: "legal",
    name: "士業事務所",
    eyebrow: "Professional",
    icon: "shield",
    tagline: "相談の前に、費用と流れをはっきり見せる。",
    customer: "税理士・行政書士・社会保険労務士・司法書士などの事務所",
    challenges: [
      "報酬が分かりにくく、問い合わせをためらわれている",
      "相談内容がばらばらで、初回のヒアリングに時間がかかる",
      "専門的な説明が多く、サイトが読まれずに離脱される",
    ],
    product: { name: "事務所・書類", note: "事務所の雰囲気や取り扱い書類を見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "documents",
    systems: [
      n("inventory", "案件管理", "layout"),
      n("crm", "顧客管理", "user"),
      n("notify", "担当者への通知", "bell"),
    ],
    catalog: [
      { sku: "LG-1001", name: "確定申告（個人事業）", category: "税務", price: 88000, stock: 10, location: "受付枠" },
      { sku: "LG-1002", name: "法人決算・申告", category: "税務", price: 220000, stock: 4, location: "受付枠" },
      { sku: "LG-2001", name: "会社設立サポート", category: "登記", price: 132000, stock: 6, location: "受付枠" },
      { sku: "LG-2002", name: "許認可申請（建設業）", category: "許認可", price: 165000, stock: 0, location: "受付枠" },
      { sku: "LG-3001", name: "顧問契約（月次）", category: "顧問", price: 33000, stock: 8, location: "受付枠" },
      { sku: "LG-3002", name: "初回相談（60分）", category: "相談", price: 0, stock: 12, location: "受付枠" },
    ],
    picks: [
      {
        demo: "simulator",
        title: "報酬の目安をその場で示す",
        scene: "事業形態・売上規模・依頼内容を選ぶと、報酬の目安と対応範囲が出ます。含まれないものも明示します。",
        effect: "「いくらか分からないから聞けない」がなくなり、問い合わせの質が上がります。",
      },
      {
        demo: "ai-chatbot",
        title: "よくある質問に、根拠つきで答える",
        scene: "対応業務・エリア・必要書類・期間などに、サイトの記載だけを根拠に回答します。判断が必要な内容には答えず、相談へ案内します。",
        effect: "士業では誤答が信用に直結するため、「答えない」判断を持つ設計が要です。",
      },
      {
        demo: "ai-agent",
        title: "生成AIに正しく引用させる",
        scene: "取扱業務・料金・対応エリアを機械が読める形（構造化データ・llms.txt）で提供し、AIの回答に事務所名が出るようにします。",
        effect: "「〇〇の相談ができる事務所」という質問への回答に載る可能性が上がります。",
      },
      {
        demo: "personalize",
        title: "個人と法人で入口を分ける",
        scene: "訪問者の関心（個人／法人、税務／許認可）に合わせて、先に見せる内容を切り替えます。",
        effect: "自分に関係ある情報にすぐ届き、読まずに離脱されにくくなります。",
      },
    ],
    alsoUseful: ["insight", "voice", "pwa", "multilingual"],
    outcomes: [
      { label: "問い合わせの質", value: "費用の前提をそろえる" },
      { label: "初回ヒアリング", value: "事前入力で短縮" },
      { label: "AI検索", value: "回答に引用される設計" },
    ],
  },

  {
    slug: "beauty",
    name: "美容室・サロン",
    eyebrow: "Beauty Salon",
    icon: "sparkles",
    tagline: "仕上がりの想像と予約を、ひと続きにする。",
    customer: "美容室、ネイル・まつげサロン、エステ、整体",
    challenges: [
      "予約の電話が施術中にかかってきて対応できない",
      "メニューが多く、初めての方がどれを選べばよいか分からない",
      "指名や再来につながる情報発信が続かない",
    ],
    product: { name: "スタイル・仕上がり", note: "仕上がりイメージや店内を見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "salon-chair",
    systems: [
      n("inventory", "予約システム", "clock"),
      n("crm", "顧客カルテ", "user"),
      n("notify", "スタッフへの通知", "chat"),
    ],
    catalog: [
      { sku: "BT-1001", name: "カット", category: "カット", price: 5500, stock: 12, location: "本店" },
      { sku: "BT-1002", name: "カット＋カラー", category: "カラー", price: 12100, stock: 6, location: "本店" },
      { sku: "BT-2001", name: "縮毛矯正", category: "ストレート", price: 18700, stock: 2, location: "本店" },
      { sku: "BT-2002", name: "ヘッドスパ（40分）", category: "スパ", price: 6600, stock: 0, location: "個室" },
      { sku: "BT-3001", name: "トリートメント", category: "ケア", price: 4400, stock: 18, location: "本店" },
      { sku: "BT-3002", name: "初回限定セット", category: "初回", price: 8800, stock: 9, location: "本店" },
    ],
    picks: [
      {
        demo: "ai-chatbot",
        title: "施術中でも予約を取りこぼさない",
        scene: "空き状況の確認からメニュー選び、予約確定までを会話で完結させます。所要時間や料金も同時に答えます。",
        effect: "手が離せない時間帯の予約を逃さなくなります。",
      },
      {
        demo: "recommend",
        title: "悩みに合うメニューを薦める",
        scene: "髪質・悩み・過去の施術から、合うメニューを理由つきで提示します。",
        effect: "メニュー選びで迷わなくなり、単価の高いメニューも納得して選ばれます。",
      },
      {
        demo: "sns",
        title: "スタイル写真をサイトに流し込む",
        scene: "SNSの投稿をそのままギャラリーとして表示し、共有時の見え方も整えます。",
        effect: "サイト更新の手間がなくなり、最新の仕上がりが常に載っている状態になります。",
      },
      {
        demo: "pwa",
        title: "次回予約のリマインドを送る",
        scene: "ホーム画面に追加でき、予約前日や次回のおすすめ時期に通知を送れます。",
        effect: "無断キャンセルが減り、再来のきっかけを作れます。",
      },
    ],
    alsoUseful: ["personalize", "animation", "insight", "ar"],
    outcomes: [
      { label: "予約の取りこぼし", value: "施術中でも自動受付" },
      { label: "メニュー単価", value: "根拠つきの提案で上積み" },
      { label: "再来", value: "通知でリマインド" },
    ],
  },

  {
    slug: "fitness",
    name: "フィットネス・ジム",
    eyebrow: "Fitness",
    icon: "bolt",
    tagline: "続けられるかどうかの不安を、体験前に解消する。",
    customer: "パーソナルジム、フィットネスクラブ、ヨガ・ピラティススタジオ",
    challenges: [
      "料金プランが複数あり、どれが自分に合うか伝わらない",
      "体験までの申し込みが長く、途中でやめられる",
      "退会理由が分からず、継続率の改善に手が付けられない",
    ],
    product: { name: "設備・マシン", note: "マシンやスタジオを立体で見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "dumbbell",
    systems: [
      n("inventory", "会員管理", "user"),
      n("crm", "レッスン予約", "clock"),
      n("notify", "トレーナーへの通知", "bell"),
    ],
    catalog: [
      { sku: "FT-1001", name: "パーソナル（月4回）", category: "パーソナル", price: 33000, stock: 5, location: "本店" },
      { sku: "FT-1002", name: "パーソナル（月8回）", category: "パーソナル", price: 61600, stock: 2, location: "本店" },
      { sku: "FT-2001", name: "通い放題プラン", category: "会員", price: 12800, stock: 20, location: "本店" },
      { sku: "FT-2002", name: "デイタイム会員", category: "会員", price: 8800, stock: 0, location: "本店" },
      { sku: "FT-3001", name: "グループレッスン", category: "レッスン", price: 2200, stock: 14, location: "スタジオ" },
      { sku: "FT-3002", name: "無料体験", category: "体験", price: 0, stock: 6, location: "本店" },
    ],
    picks: [
      {
        demo: "simulator",
        title: "自分に合うプランを診断する",
        scene: "目的・頻度・期間を選ぶと、おすすめプランと月額・総額が出ます。他プランとの差額も同時に表示します。",
        effect: "プラン選びで迷わなくなり、体験申し込みまでの離脱が減ります。",
      },
      {
        demo: "personalize",
        title: "目的別に見せる内容を変える",
        scene: "ダイエット／筋力アップ／姿勢改善など、関心に合わせてトップの内容を切り替えます。",
        effect: "「自分向けだ」と感じてもらえ、申し込みにつながりやすくなります。",
      },
      {
        demo: "pwa",
        title: "予約とリマインドをアプリのように",
        scene: "ホーム画面に追加してレッスン予約と通知を受け取れます。オフラインでも時間割は見られます。",
        effect: "アプリを開発しなくても、アプリに近い体験を用意できます。",
      },
      {
        demo: "insight",
        title: "どこで離脱しているかを測る",
        scene: "申し込みページのクリック位置をヒートマップで見て、ボタンの位置や文言をA/Bテストで比較します。",
        effect: "感覚ではなく数字で改善でき、体験申し込み率を上げられます。",
      },
    ],
    alsoUseful: ["ai-chatbot", "animation", "sns", "voice"],
    outcomes: [
      { label: "プラン選び", value: "診断で自走化" },
      { label: "体験申し込み", value: "離脱箇所を特定して改善" },
      { label: "継続率", value: "通知で来店を後押し" },
    ],
  },

  {
    slug: "hotel",
    name: "宿泊・観光",
    eyebrow: "Hospitality",
    icon: "globe",
    tagline: "泊まる前の体験を、多言語で先に届ける。",
    customer: "旅館・ホテル・ゲストハウス、観光施設、体験プログラム",
    challenges: [
      "予約サイト経由が中心で、手数料の負担が大きい",
      "海外からの問い合わせに、言語と時差の両方で対応しきれない",
      "部屋や設備の雰囲気が写真だけでは伝わらない",
    ],
    product: { name: "客室・施設", note: "客室や露天風呂などを立体で見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "guestroom",
    systems: [
      n("inventory", "宿泊管理（PMS）", "layout"),
      n("crm", "予約サイト連携", "share"),
      n("notify", "フロントへの通知", "bell"),
    ],
    catalog: [
      { sku: "HT-1001", name: "和室（2名・食事付）", category: "客室", price: 24000, stock: 4, location: "本館" },
      { sku: "HT-1002", name: "露天風呂付客室", category: "客室", price: 46000, stock: 1, location: "離れ" },
      { sku: "HT-2001", name: "洋室ツイン", category: "客室", price: 18000, stock: 8, location: "新館" },
      { sku: "HT-2002", name: "ドミトリー", category: "客室", price: 4800, stock: 0, location: "別棟" },
      { sku: "HT-3001", name: "茶道体験プラン", category: "体験", price: 5500, stock: 12, location: "茶室" },
      { sku: "HT-3002", name: "夕食のみ（会席）", category: "食事", price: 8800, stock: 20, location: "食事処" },
    ],
    picks: [
      {
        demo: "multilingual",
        title: "言語・通貨・日付をまとめて切り替える",
        scene: "訪問者の設定を見て言語を切り替え、料金は現地通貨の目安で、日付はその国の書式で表示します。検索エンジンにも言語別に正しく伝えます。",
        effect: "海外からの直接予約が取りやすくなり、予約サイトの手数料を圧縮できます。",
      },
      {
        demo: "3dcg",
        title: "客室と露天風呂を回して見せる",
        scene: "写真では伝わらない広さや眺望を、回して確かめられるようにします。",
        effect: "「思っていたのと違う」を防ぎ、上位の部屋タイプが選ばれやすくなります。",
      },
      {
        demo: "ai-chatbot",
        title: "時差のある問い合わせに24時間答える",
        scene: "チェックイン時間・アクセス・食事の内容・アレルギー対応などに、サイトの記載を根拠に答えます。空室確認から予約まで進めます。",
        effect: "夜間・時差のある問い合わせを取りこぼしません。",
      },
      {
        demo: "voice",
        title: "話しかけて館内を案内する",
        scene: "館内タブレットやスマートフォンで、話しかけると営業時間や設備を読み上げて案内します。",
        effect: "フロントの問い合わせが減り、多言語での案内も同じ仕組みで行えます。",
      },
    ],
    alsoUseful: ["ar", "sns", "personalize", "ai-agent"],
    outcomes: [
      { label: "直接予約", value: "手数料のかからない経路を増やす" },
      { label: "海外対応", value: "言語と時差の両方をカバー" },
      { label: "客室単価", value: "3Dで上位タイプを選ばれやすく" },
    ],
  },

  {
    slug: "logistics",
    name: "運送・物流",
    eyebrow: "Logistics",
    icon: "plug",
    tagline: "見積もりと問い合わせを、電話から切り離す。",
    customer: "運送会社、倉庫業、引越し、配送代行",
    challenges: [
      "見積もりの電話が多く、その場で概算を答えられないと失注する",
      "配送状況の問い合わせに人手を取られている",
      "荷主の基幹システムと自社の管理がつながっていない",
    ],
    product: { name: "車両・設備", note: "車両や倉庫設備を立体で見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "truck",
    systems: [
      n("inventory", "倉庫管理（WMS）", "cart"),
      n("crm", "配送管理（TMS）", "clock"),
      n("notify", "配車担当への通知", "bell"),
    ],
    catalog: [
      { sku: "LG-1001", name: "軽貨物（市内・当日）", category: "配送", price: 8000, stock: 6, location: "京都営業所" },
      { sku: "LG-1002", name: "2tトラック（府内）", category: "配送", price: 24000, stock: 3, location: "京都営業所" },
      { sku: "LG-2001", name: "4tトラック（関西圏）", category: "配送", price: 52000, stock: 1, location: "大阪営業所" },
      { sku: "LG-2002", name: "チャーター便（長距離）", category: "配送", price: 0, stock: 0, location: "要相談" },
      { sku: "LG-3001", name: "保管（パレット/月）", category: "倉庫", price: 4500, stock: 240, location: "第1倉庫" },
      { sku: "LG-3002", name: "流通加工（梱包）", category: "倉庫", price: 180, stock: 999, location: "第1倉庫" },
    ],
    picks: [
      {
        demo: "simulator",
        title: "配送の概算をその場で出す",
        scene: "距離・荷量・車種・時間帯を選ぶと、概算料金と対応可否が出ます。対応できない条件はその場で伝えます。",
        effect: "電話での見積もり対応が減り、条件の合う依頼だけが問い合わせに残ります。",
      },
      {
        demo: "integration",
        title: "荷主のシステムと在庫・出荷をつなぐ",
        scene: "受注を倉庫管理に引き当て、配送管理へ渡し、配車担当へ通知するまでを自動化します。失敗時は自動で再試行します。",
        effect: "転記作業と連絡もれがなくなります。API連携なので夜間でも動きます。",
      },
      {
        demo: "ai-chatbot",
        title: "配送状況の問い合わせを引き受ける",
        scene: "対応エリア・締め時間・料金体系などの定型質問に答え、個別の追跡は担当へつなぎます。",
        effect: "電話対応の件数が減り、現場が本来の業務に戻れます。",
      },
      {
        demo: "pwa",
        title: "現場で使える通知と表示",
        scene: "ドライバーや倉庫スタッフがホーム画面から開き、通信が不安定な場所でも必要な情報を表示できます。",
        effect: "アプリを開発しなくても、現場で使える形になります。",
      },
    ],
    alsoUseful: ["insight", "ai-agent", "personalize", "multilingual"],
    outcomes: [
      { label: "見積もり電話", value: "概算の自動提示で削減" },
      { label: "転記作業", value: "API連携でゼロに" },
      { label: "失注", value: "即答できることで防ぐ" },
    ],
  },

  {
    slug: "auto",
    name: "自動車販売・整備",
    eyebrow: "Automotive",
    icon: "gauge",
    tagline: "車両の状態と費用を、来店前に納得してもらう。",
    customer: "中古車販売、整備工場、板金塗装、カー用品",
    challenges: [
      "車両の状態が写真では伝わらず、来店してから話が変わる",
      "車検・整備の費用感が分からず、問い合わせに至らない",
      "点検時期の案内がハガキと電話に頼っている",
    ],
    product: { name: "車両・パーツ", note: "車両やホイールなどを立体で見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "wheel",
    systems: [
      n("inventory", "車両在庫管理", "cart"),
      n("crm", "顧客・車歴管理", "user"),
      n("notify", "工場への通知", "bell"),
    ],
    catalog: [
      { sku: "AU-1001", name: "コンパクトカー（2020年式）", category: "中古車", price: 1280000, stock: 1, location: "本店展示場" },
      { sku: "AU-1002", name: "ミニバン（2019年式）", category: "中古車", price: 1850000, stock: 2, location: "本店展示場" },
      { sku: "AU-2001", name: "車検（普通車・標準）", category: "整備", price: 78000, stock: 8, location: "整備工場" },
      { sku: "AU-2002", name: "板金塗装（1パネル）", category: "板金", price: 42000, stock: 0, location: "板金工場" },
      { sku: "AU-3001", name: "タイヤ交換（4本）", category: "用品", price: 18000, stock: 24, location: "本店" },
      { sku: "AU-3002", name: "12か月点検", category: "整備", price: 16500, stock: 12, location: "整備工場" },
    ],
    picks: [
      {
        demo: "3dcg",
        title: "車両を回して、傷まで見せる",
        scene: "外装・内装を回して確認でき、キズの位置を指し示せます。ホイールやオプションの見え方も切り替えられます。",
        effect: "来店してからの認識違いがなくなり、遠方からの問い合わせにも対応できます。",
      },
      {
        demo: "simulator",
        title: "車検・整備の費用を試算する",
        scene: "車種・年式・走行距離・整備内容を選ぶと、概算費用と作業時間が出ます。法定費用と工賃も分けて表示します。",
        effect: "「いくらかかるか分からない」で他店に流れるのを防げます。",
      },
      {
        demo: "configurator",
        title: "オプションを選んで価格を見る",
        scene: "ホイール・カラー・装備を選ぶと、見た目と総額がその場で変わります。構成はそのまま問い合わせに渡せます。",
        effect: "オプションの追加が決まりやすくなり、単価が上がります。",
      },
      {
        demo: "pwa",
        title: "点検時期を通知で知らせる",
        scene: "ホーム画面に追加してもらい、車検・点検の時期に通知を出します。",
        effect: "ハガキと電話のコストが下がり、入庫率が上がります。",
      },
    ],
    alsoUseful: ["ai-chatbot", "recommend", "insight", "ar"],
    outcomes: [
      { label: "認識違い", value: "3Dで状態を先に共有" },
      { label: "費用の相談", value: "試算で自走化" },
      { label: "入庫率", value: "通知で点検時期を案内" },
    ],
  },

  {
    slug: "agriculture",
    name: "農業・食品生産",
    eyebrow: "Agriculture",
    icon: "heart",
    tagline: "作り手の顔と、こだわりの理由を届ける。",
    customer: "農家、加工品メーカー、直売所、産地直送のEC",
    challenges: [
      "価格でしか比較されず、こだわりが伝わらない",
      "収穫期に注文が集中し、在庫と発送の管理が追いつかない",
      "リピートにつながる接点がなく、単発の購入で終わる",
    ],
    product: { name: "農産物・加工品", note: "商品パッケージや詰め合わせを見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "crate",
    systems: [
      n("inventory", "在庫・収穫管理", "cart"),
      n("crm", "発送管理", "clock"),
      n("notify", "生産者への通知", "chat"),
    ],
    catalog: [
      { sku: "AG-1001", name: "旬の野菜セット（S）", category: "野菜", price: 3200, stock: 40, location: "直売所" },
      { sku: "AG-1002", name: "旬の野菜セット（L）", category: "野菜", price: 5400, stock: 12, location: "直売所" },
      { sku: "AG-2001", name: "有機米 5kg", category: "米", price: 4800, stock: 60, location: "低温倉庫" },
      { sku: "AG-2002", name: "季節の果物 化粧箱", category: "果物", price: 6800, stock: 0, location: "予約受付" },
      { sku: "AG-3001", name: "自家製ジャム 3個組", category: "加工品", price: 2400, stock: 85, location: "加工場" },
      { sku: "AG-3002", name: "定期便（月1回）", category: "定期", price: 4500, stock: 30, location: "直売所" },
    ],
    picks: [
      {
        demo: "sns",
        title: "畑の様子をそのままサイトに載せる",
        scene: "日々の投稿をサイトに自動で流し込み、共有時のカードも整えます。作業の様子がそのまま「こだわりの根拠」になります。",
        effect: "更新の手間なく、価格以外の判断材料を渡せます。",
      },
      {
        demo: "recommend",
        title: "好みに合う商品を薦める",
        scene: "購入・閲覧の履歴から、次に合う商品を理由つきで表示します。定期便への導線もここに置けます。",
        effect: "単発購入からリピートへつながりやすくなります。",
      },
      {
        demo: "integration",
        title: "収穫量と受注をつなぐ",
        scene: "注文を在庫に引き当て、発送管理へ渡し、生産者へ通知します。売り切れは即座にサイトへ反映されます。",
        effect: "収穫期の注文集中でも、受けすぎ・欠品が起きません。",
      },
      {
        demo: "personalize",
        title: "初めての方とリピーターで見せ方を変える",
        scene: "初めての方にはお試しセットを、リピーターには定期便と旬の商品を先に出します。",
        effect: "それぞれに合った次の一歩を示せます。",
      },
    ],
    alsoUseful: ["3dcg", "ai-chatbot", "multilingual", "insight"],
    outcomes: [
      { label: "価格競争", value: "こだわりの可視化で回避" },
      { label: "欠品トラブル", value: "在庫連携で防止" },
      { label: "リピート", value: "定期便への導線を設計" },
    ],
  },

  {
    slug: "bridal",
    name: "ブライダル・イベント",
    eyebrow: "Bridal & Event",
    icon: "award",
    tagline: "当日の景色を先に見せて、迷いをなくす。",
    customer: "結婚式場、写真スタジオ、イベント企画、レンタルスペース",
    challenges: [
      "見学に来てもらうまでのハードルが高い",
      "見積もりが複雑で、総額の不安から決めきれない",
      "当日のイメージが写真だけでは共有できない",
    ],
    product: { name: "会場・装飾", note: "会場のレイアウトや装花を立体で見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "arch",
    systems: [
      n("inventory", "見学・予約管理", "clock"),
      n("crm", "見積・プラン管理", "calc"),
      n("notify", "プランナーへの通知", "bell"),
    ],
    catalog: [
      { sku: "BR-1001", name: "挙式＋披露宴（60名）", category: "プラン", price: 2800000, stock: 3, location: "本館" },
      { sku: "BR-1002", name: "少人数ウェディング（20名）", category: "プラン", price: 980000, stock: 5, location: "別館" },
      { sku: "BR-2001", name: "フォトウェディング", category: "撮影", price: 198000, stock: 8, location: "スタジオ" },
      { sku: "BR-2002", name: "土曜大安 挙式枠", category: "枠", price: 0, stock: 0, location: "本館" },
      { sku: "BR-3001", name: "装花アップグレード", category: "オプション", price: 165000, stock: 12, location: "本館" },
      { sku: "BR-3002", name: "会場見学（無料）", category: "見学", price: 0, stock: 10, location: "本館" },
    ],
    picks: [
      {
        demo: "3dcg",
        title: "会場を回して、当日の景色を見せる",
        scene: "席のレイアウトや装花の色を切り替えながら、会場を回して確認できます。",
        effect: "見学前に具体的なイメージが共有でき、来館後の打ち合わせが早く進みます。",
      },
      {
        demo: "simulator",
        title: "総額の目安をその場で出す",
        scene: "人数・プラン・オプション・時期を選ぶと総額と内訳が出ます。含まれないものも明記します。",
        effect: "総額の不安が減り、見学申し込みまでの心理的な壁が下がります。",
      },
      {
        demo: "configurator",
        title: "装飾や衣装の組み合わせを試す",
        scene: "色・装花・小物を選ぶと、見た目と価格がその場で変わります。決めた構成はそのまま相談に渡せます。",
        effect: "打ち合わせの回数が減り、オプションの決定率が上がります。",
      },
      {
        demo: "animation",
        title: "写真だけでは出ない空気感を作る",
        scene: "スクロールに合わせた光や動きで、当日の高揚感をサイト上で表現します。",
        effect: "他社との印象の差が出ます。動きは軽量な実装なので表示速度も落ちません。",
      },
    ],
    alsoUseful: ["ar", "sns", "ai-chatbot", "insight"],
    outcomes: [
      { label: "見学申し込み", value: "総額の見通しで後押し" },
      { label: "打ち合わせ回数", value: "事前の共有で削減" },
      { label: "オプション", value: "その場で試せて決まりやすい" },
    ],
  },

  {
    slug: "care",
    name: "介護・福祉",
    eyebrow: "Care Service",
    icon: "user",
    tagline: "家族が知りたいことを、迷わせずに届ける。",
    customer: "デイサービス、訪問介護、住宅型施設、障がい福祉サービス",
    challenges: [
      "利用を検討するのは本人ではなく家族で、知りたい情報が違う",
      "見学の前に施設の雰囲気が伝わらず、比較検討で外れる",
      "空き状況の問い合わせ電話が多く、現場の手が止まる",
    ],
    product: { name: "施設・設備", note: "居室や共用スペースを立体で見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "care-bed",
    systems: [
      n("inventory", "介護記録システム", "layout"),
      n("crm", "見学・空き管理", "clock"),
      n("notify", "相談員への通知", "bell"),
    ],
    catalog: [
      { sku: "CR-1001", name: "デイサービス（週3）", category: "通所", price: 0, stock: 4, location: "本施設" },
      { sku: "CR-1002", name: "訪問介護（週2）", category: "訪問", price: 0, stock: 6, location: "訪問枠" },
      { sku: "CR-2001", name: "ショートステイ", category: "短期", price: 0, stock: 2, location: "本施設" },
      { sku: "CR-2002", name: "住宅型（個室）", category: "入居", price: 0, stock: 0, location: "本施設" },
      { sku: "CR-3001", name: "リハビリ特化型", category: "通所", price: 0, stock: 5, location: "別館" },
      { sku: "CR-3002", name: "施設見学（無料）", category: "見学", price: 0, stock: 12, location: "本施設" },
    ],
    picks: [
      {
        demo: "personalize",
        title: "ご本人向けと家族向けを分ける",
        scene: "検討しているのが家族か本人かで、先に見せる内容（費用・空き状況／過ごし方・食事）を切り替えます。",
        effect: "知りたい情報にすぐ届き、比較検討から外れにくくなります。",
      },
      {
        demo: "3dcg",
        title: "居室と共用スペースを見せる",
        scene: "写真では分からない広さや手すりの位置まで、回して確認できます。",
        effect: "見学前に安心してもらえ、遠方のご家族にも判断材料を渡せます。",
      },
      {
        demo: "ai-chatbot",
        title: "空き状況と利用条件の質問に答える",
        scene: "対象となる要介護度・費用の仕組み・送迎範囲などに、サイトの記載を根拠に答えます。判断が必要な相談は相談員へつなぎます。",
        effect: "現場の電話対応が減り、必要な相談だけが人に回ります。",
      },
      {
        demo: "voice",
        title: "話しかけて操作できるようにする",
        scene: "文字が読みづらい方でも、話しかけて情報を聞き、読み上げで受け取れます。",
        effect: "ご本人が自分で情報にたどり着けるようになります。",
      },
    ],
    alsoUseful: ["ar", "pwa", "insight", "ai-agent"],
    outcomes: [
      { label: "問い合わせ電話", value: "定型質問ぶんを削減" },
      { label: "見学前の不安", value: "施設の様子を先に共有" },
      { label: "情報の届きやすさ", value: "立場別に出し分け" },
    ],
  },

  {
    slug: "saas",
    name: "IT・SaaS",
    eyebrow: "IT & SaaS",
    icon: "code",
    tagline: "触ってもらってから、商談に入る。",
    customer: "SaaS・Webサービス事業者、受託開発、システム販売",
    challenges: [
      "機能説明だけでは伝わらず、デモの日程調整で時間を失う",
      "料金体系が複雑で、問い合わせ前に比較検討から外れる",
      "生成AI経由の流入が増えているのに、AIに正しく読まれていない",
    ],
    product: { name: "プロダクト・画面", note: "プロダクトのイメージやデータの流れを見せる想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "server",
    systems: [
      n("inventory", "CRM（商談管理）", "user"),
      n("crm", "課金・請求", "calc"),
      n("notify", "Slack通知", "chat"),
    ],
    catalog: [
      { sku: "SA-1001", name: "スタータープラン", category: "プラン", price: 9800, stock: 999, location: "クラウド" },
      { sku: "SA-1002", name: "ビジネスプラン", category: "プラン", price: 29800, stock: 999, location: "クラウド" },
      { sku: "SA-2001", name: "エンタープライズ", category: "プラン", price: 0, stock: 3, location: "個別見積" },
      { sku: "SA-2002", name: "オンプレミス版", category: "導入", price: 0, stock: 0, location: "要相談" },
      { sku: "SA-3001", name: "初期導入支援", category: "支援", price: 220000, stock: 6, location: "オンライン" },
      { sku: "SA-3002", name: "API利用（従量）", category: "API", price: 3, stock: 999, location: "クラウド" },
    ],
    picks: [
      {
        demo: "simulator",
        title: "料金をその場で試算させる",
        scene: "利用人数・機能・契約期間を選ぶと、月額と年額、他プランとの差額まで出ます。",
        effect: "「問い合わせないと分からない」を無くし、比較検討の段階で候補に残ります。",
      },
      {
        demo: "ai-agent",
        title: "生成AIに正しく読ませる",
        scene: "機能・料金・対応範囲を構造化データと llms.txt で機械可読にし、AIクローラーを明示的に許可します。",
        effect: "ChatGPTなどの回答に、正しい情報でサービス名が載る可能性が上がります。",
      },
      {
        demo: "integration",
        title: "問い合わせを商談管理へ流す",
        scene: "フォーム送信をCRMへ登録し、Slackへ通知し、失敗時は自動で再試行します。",
        effect: "初回接触までの時間が短くなり、対応もれがなくなります。",
      },
      {
        demo: "insight",
        title: "改善をA/Bテストで判断する",
        scene: "クリック位置のヒートマップと、2案の比較（有意差の判定つき）で、感覚ではなく数字で決めます。",
        effect: "サンプル数が足りないときは「判定できない」と出るので、誤った意思決定を防げます。",
      },
    ],
    alsoUseful: ["ai-chatbot", "animation", "personalize", "multilingual"],
    outcomes: [
      { label: "商談前の離脱", value: "料金の透明化で改善" },
      { label: "AI経由の流入", value: "引用される設計に" },
      { label: "初回接触", value: "自動連携で即応" },
    ],
  },

  {
    slug: "apparel",
    name: "アパレル・ファッション",
    eyebrow: "Apparel",
    icon: "palette",
    tagline: "サイズと色の不安を、返品の前に取り除く。",
    customer: "アパレルブランド、セレクトショップ、オーダーメイド",
    challenges: [
      "色味とサイズの相違による返品が多い",
      "商品点数が多く、探しているものにたどり着けない",
      "実店舗とオンラインで在庫が別管理になっている",
    ],
    product: { name: "商品・素材", note: "生地や小物を立体で見せて、質感を伝える想定です" },
    // 3DCG・ARデモで実際に表示する立体（industryModels.ts）
    model: "garment",
    systems: [
      n("inventory", "店舗・EC統合在庫", "cart"),
      n("crm", "会員管理", "user"),
      n("notify", "店舗への通知", "chat"),
    ],
    catalog: [
      { sku: "AP-1001", name: "ウールコート", category: "アウター", price: 58000, stock: 6, location: "本店" },
      { sku: "AP-1002", name: "リネンシャツ", category: "トップス", price: 16500, stock: 24, location: "EC倉庫" },
      { sku: "AP-2001", name: "レザーバッグ", category: "バッグ", price: 42000, stock: 3, location: "本店" },
      { sku: "AP-2002", name: "限定スカーフ", category: "小物", price: 12000, stock: 0, location: "EC倉庫" },
      { sku: "AP-3001", name: "デニムパンツ", category: "ボトムス", price: 19800, stock: 18, location: "EC倉庫" },
      { sku: "AP-3002", name: "オーダーシャツ", category: "オーダー", price: 24000, stock: 9, location: "アトリエ" },
    ],
    picks: [
      {
        demo: "configurator",
        title: "色・素材を選んで、その場で見た目を変える",
        scene: "生地・色・ボタン・サイズを選ぶと、見た目と価格・納期がリアルタイムに変わります。構成コードも発行されます。",
        effect: "オーダー商品の相談がオンラインで完結し、返品の理由も減ります。",
      },
      {
        demo: "ar",
        title: "実物大で確かめてもらう",
        scene: "バッグや小物を、スマートフォンのカメラで実物大に表示。手元に置いたときの大きさが分かります。",
        effect: "「思ったより大きかった」による返品が減ります。",
      },
      {
        demo: "recommend",
        title: "コーディネートとして薦める",
        scene: "見ている商品と相性のよいアイテムを、理由つきで提示します。閲覧の傾向も加味します。",
        effect: "セット購入が増え、客単価が上がります。",
      },
      {
        demo: "integration",
        title: "店舗とECの在庫を1つにする",
        scene: "注文が入ったら統合在庫へ引き当て、会員情報へ記録し、店舗スタッフへ通知します。",
        effect: "二重販売がなくなり、店舗在庫もオンラインで売れるようになります。",
      },
    ],
    alsoUseful: ["3dcg", "sns", "personalize", "insight"],
    outcomes: [
      { label: "返品率", value: "サイズ・色の確認手段を用意" },
      { label: "客単価", value: "コーディネート提案で上積み" },
      { label: "在庫", value: "店舗とECを統合" },
    ],
  },
];

/** slug から職種を取得 */
export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

/** 職種ページで使うデモの一覧（重複を除いたもの） */
export function usedDemos(industry: Industry): DemoSlug[] {
  return [...new Set([...industry.picks.map((p) => p.demo), ...industry.alsoUseful])];
}
