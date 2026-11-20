const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const PREVIEWS = [
  {
    infoFile: 'days_together_widget_info.xml',
    previewName: 'days_together_widget_preview',
    layoutName: 'days_together_widget_preview',
    source: 'assets/images/widgets/days_together_widget_preview.jpg',
    layoutXml: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:orientation="horizontal"
  android:background="@drawable/loveni_widget_card_bg"
  android:padding="14dp">
  <LinearLayout
    android:layout_width="0dp"
    android:layout_height="match_parent"
    android:layout_weight="1.35"
    android:orientation="vertical"
    android:gravity="center_vertical">
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="♡∞  Loveni"
      android:textColor="#FFFFFF"
      android:textStyle="bold"
      android:textSize="12sp" />
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:layout_marginTop="10dp"
      android:text="Y  ··· ♡ ···  P"
      android:textColor="#FF8FBF"
      android:textStyle="bold"
      android:textSize="14sp" />
  </LinearLayout>
  <View
    android:layout_width="1dp"
    android:layout_height="match_parent"
    android:layout_marginTop="8dp"
    android:layout_marginBottom="8dp"
    android:background="#66FFFFFF" />
  <LinearLayout
    android:layout_width="0dp"
    android:layout_height="match_parent"
    android:layout_weight="1"
    android:gravity="center"
    android:orientation="vertical"
    android:paddingStart="10dp">
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="♡♡"
      android:textColor="#FF8FBF"
      android:textSize="13sp" />
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="128"
      android:textColor="#FFFFFF"
      android:textStyle="bold"
      android:textSize="32sp" />
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="days together"
      android:textColor="#D4B8E8"
      android:textSize="11sp" />
  </LinearLayout>
</LinearLayout>
`,
  },
  {
    infoFile: 'mood_today_widget_info.xml',
    previewName: 'mood_today_widget_preview',
    layoutName: 'mood_today_widget_preview',
    source: 'assets/images/widgets/mood_today_widget_preview.jpg',
    layoutXml: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:orientation="horizontal"
  android:gravity="center_vertical"
  android:background="@drawable/loveni_mood_widget_bg"
  android:padding="10dp">
  <TextView
    android:layout_width="40dp"
    android:layout_height="40dp"
    android:background="@drawable/loveni_widget_icon_bg"
    android:gravity="center"
    android:text="☺"
    android:textColor="#1A1014"
    android:textSize="18sp" />
  <View
    android:layout_width="1dp"
    android:layout_height="match_parent"
    android:layout_marginLeft="8dp"
    android:layout_marginRight="8dp"
    android:layout_marginTop="6dp"
    android:layout_marginBottom="6dp"
    android:background="#55FFFFFF" />
  <LinearLayout
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:layout_marginRight="8dp">
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="Aeni's Mood"
      android:textColor="#D9C4CF"
      android:textSize="12sp" />
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="Happy"
      android:textColor="#FFFFFF"
      android:textStyle="bold"
      android:textSize="17sp" />
  </LinearLayout>
  <View
    android:layout_width="1dp"
    android:layout_height="match_parent"
    android:layout_marginRight="8dp"
    android:layout_marginTop="6dp"
    android:layout_marginBottom="6dp"
    android:background="#55FFFFFF" />
  <TextView
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:layout_weight="1"
    android:text="✦✦ Feeling really good today! ♡"
    android:textColor="#FFFFFF"
    android:textSize="13sp"
    android:maxLines="2" />
</LinearLayout>
`,
  },
  {
    infoFile: 'love_note_widget_info.xml',
    previewName: 'love_note_widget_preview',
    layoutName: 'love_note_widget_preview',
    source: 'assets/images/widgets/love_note_widget_preview.jpg',
    layoutXml: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:orientation="horizontal"
  android:gravity="center_vertical"
  android:background="@drawable/loveni_note_widget_bg"
  android:padding="10dp">
  <TextView
    android:layout_width="40dp"
    android:layout_height="40dp"
    android:background="@drawable/loveni_widget_icon_bg"
    android:gravity="center"
    android:text="✉"
    android:textColor="#1A1014"
    android:textSize="16sp" />
  <View
    android:layout_width="1dp"
    android:layout_height="match_parent"
    android:layout_marginLeft="8dp"
    android:layout_marginRight="8dp"
    android:layout_marginTop="6dp"
    android:layout_marginBottom="6dp"
    android:background="#55FFFFFF" />
  <LinearLayout
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:layout_weight="1"
    android:orientation="vertical"
    android:layout_marginRight="6dp">
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="Today's Note"
      android:textColor="#D9C4CF"
      android:textSize="12sp" />
    <TextView
      android:layout_width="match_parent"
      android:layout_height="wrap_content"
      android:text="Can't wait to see you ♡"
      android:textColor="#FFFFFF"
      android:textStyle="bold"
      android:textSize="16sp"
      android:maxLines="2" />
  </LinearLayout>
  <TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="♡"
    android:textColor="#FF8FBF"
    android:textSize="22sp" />
</LinearLayout>
`,
  },
];

const CARD_BG_XML = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
  android:shape="rectangle">
  <gradient
    android:angle="270"
    android:startColor="#785597"
    android:endColor="#3F2758"
    android:type="linear" />
  <corners android:radius="24dp" />
  <stroke
    android:width="1.5dp"
    android:color="#C9A6E8" />
</shape>
`;

const MOOD_BG_XML = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
  android:shape="rectangle">
  <solid android:color="#2A1A24" />
  <corners android:radius="20dp" />
</shape>
`;

const MOOD_BADGE_BG_XML = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
  android:shape="rectangle">
  <solid android:color="#F7B6C8" />
  <corners android:radius="999dp" />
</shape>
`;

const WIDGET_ICON_BG_XML = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
  android:shape="rectangle">
  <solid android:color="#FFB0C4" />
  <corners android:radius="12dp" />
</shape>
`;

const NOTE_BG_XML = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
  android:shape="rectangle">
  <solid android:color="#2A1A24" />
  <corners android:radius="20dp" />
</shape>
`;

function patchWidgetInfoXml(xml, previewName, layoutName) {
  let next = xml;

  if (next.includes('android:previewImage=')) {
    next = next.replace(
      /android:previewImage="[^"]*"/,
      `android:previewImage="@drawable/${previewName}"`
    );
  } else {
    next = next.replace(
      'android:widgetCategory="home_screen"',
      `android:previewImage="@drawable/${previewName}"\n  android:widgetCategory="home_screen"`
    );
  }

  if (next.includes('android:previewLayout=')) {
    next = next.replace(
      /android:previewLayout="[^"]*"/,
      `android:previewLayout="@layout/${layoutName}"`
    );
  } else {
    next = next.replace(
      `android:previewImage="@drawable/${previewName}"`,
      `android:previewImage="@drawable/${previewName}"\n  android:previewLayout="@layout/${layoutName}"`
    );
  }

  return next;
}

function applyWidgetPreviews({ projectRoot, androidRoot }) {
  const drawableDir = path.join(androidRoot, 'app/src/main/res/drawable');
  const nodpiDir = path.join(androidRoot, 'app/src/main/res/drawable-nodpi');
  const layoutDir = path.join(androidRoot, 'app/src/main/res/layout');
  const xmlDir = path.join(androidRoot, 'app/src/main/res/xml');

  fs.mkdirSync(drawableDir, { recursive: true });
  fs.mkdirSync(nodpiDir, { recursive: true });
  fs.mkdirSync(layoutDir, { recursive: true });

  fs.writeFileSync(path.join(drawableDir, 'loveni_widget_card_bg.xml'), CARD_BG_XML);
  fs.writeFileSync(path.join(drawableDir, 'loveni_mood_widget_bg.xml'), MOOD_BG_XML);
  fs.writeFileSync(path.join(drawableDir, 'loveni_mood_badge_bg.xml'), MOOD_BADGE_BG_XML);
  fs.writeFileSync(path.join(drawableDir, 'loveni_widget_icon_bg.xml'), WIDGET_ICON_BG_XML);
  fs.writeFileSync(path.join(drawableDir, 'loveni_note_widget_bg.xml'), NOTE_BG_XML);

  for (const preview of PREVIEWS) {
    const sourcePath = path.join(projectRoot, preview.source);
    if (fs.existsSync(sourcePath)) {
      const fileName = `${preview.previewName}.jpg`;
      fs.copyFileSync(sourcePath, path.join(drawableDir, fileName));
      fs.copyFileSync(sourcePath, path.join(nodpiDir, fileName));
    } else {
      console.warn(`[withLoveniWidgetPreviews] Missing preview asset: ${preview.source}`);
    }

    fs.writeFileSync(path.join(layoutDir, `${preview.layoutName}.xml`), preview.layoutXml);

    const infoPath = path.join(xmlDir, preview.infoFile);
    if (!fs.existsSync(infoPath)) {
      console.warn(`[withLoveniWidgetPreviews] Missing widget info XML: ${preview.infoFile}`);
      continue;
    }

    const xml = fs.readFileSync(infoPath, 'utf8');
    fs.writeFileSync(infoPath, patchWidgetInfoXml(xml, preview.previewName, preview.layoutName));
  }
}

/**
 * Adds Android widget picker previews (previewLayout + previewImage).
 * Must be listed AFTER the expo-widgets plugin in app.json.
 */
function withLoveniWidgetPreviews(config) {
  return withDangerousMod(config, [
    'android',
    async (cfg) => {
      applyWidgetPreviews({
        projectRoot: cfg.modRequest.projectRoot,
        androidRoot: cfg.modRequest.platformProjectRoot,
      });
      return cfg;
    },
  ]);
}

withLoveniWidgetPreviews.applyWidgetPreviews = applyWidgetPreviews;

module.exports = withLoveniWidgetPreviews;
