package app.sunnyabc;

import androidx.appcompat.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

public class UpdateClient {
    private static final String API =
            "https://api.github.com/repos/wilsonsamiano/sunny-abc/releases?per_page=10";
    private static final String ASSET = "sunny-abc-beta.apk";

    private final MainActivity activity;
    private final WebView webView;
    private final File apkFile;
    private final String currentVersion;
    private volatile String statusJson;
    private volatile boolean busy;
    private String readyVersion = "";
    private boolean asked;
    private boolean forceOffer;
    private long lastCheck;

    public UpdateClient(MainActivity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        this.apkFile = new File(activity.getCacheDir(), "sunny-update.apk");
        this.currentVersion = readVersion();
        this.statusJson = json("checking", "");
    }

    public void attach() {
        webView.addJavascriptInterface(this, "SunnyUpdate");
    }

    public void start() {
        begin(false);
    }

    @JavascriptInterface
    public void refresh() {
        activity.runOnUiThread(() -> begin(true));
    }

    @JavascriptInterface
    public String status() {
        return statusJson;
    }

    @JavascriptInterface
    public void install() {
        activity.runOnUiThread(this::openInstaller);
    }

    private void begin(boolean force) {
        if (busy) {
            if (force) forceOffer = true;
            return;
        }
        long now = System.currentTimeMillis();
        if (!force && now - lastCheck < 60000) return;
        busy = true;
        lastCheck = now;
        if (force) {
            asked = false;
            forceOffer = true;
            setStatus(json("checking", ""));
        }
        new Thread(() -> {
            try {
                check();
            } finally {
                busy = false;
            }
        }, "sunny-update").start();
    }

    private void check() {
        HttpURLConnection conn = null;
        try {
            conn = open(API);
            int code = conn.getResponseCode();
            if (code < 200 || code >= 300) {
                setStatus(json("error", ""));
                return;
            }
            String body = read(conn.getInputStream());
            JSONArray releases = new JSONArray(body);
            String bestTag = "";
            String bestUrl = "";
            int i;
            for (i = 0; i < releases.length(); i++) {
                JSONObject rel = releases.getJSONObject(i);
                String tag = rel.optString("tag_name", "");
                if (!newer(tag, currentVersion)) continue;
                if (bestTag.length() > 0 && !newer(tag, bestTag)) continue;
                JSONArray assets = rel.optJSONArray("assets");
                if (assets == null) continue;
                int a;
                for (a = 0; a < assets.length(); a++) {
                    JSONObject asset = assets.getJSONObject(a);
                    if (!ASSET.equals(asset.optString("name"))) continue;
                    String url = asset.optString("browser_download_url", "");
                    if (url.length() == 0) continue;
                    bestTag = tag;
                    bestUrl = url;
                }
            }
            if (bestUrl.length() == 0) {
                setStatus(json("current", ""));
                return;
            }
            String pretty = pretty(bestTag);
            if (pretty.equals(readyVersion) && looksLikeApk(apkFile)) {
                setStatus(json("ready", pretty));
                return;
            }
            setStatus(json("downloading", pretty));
            download(bestUrl);
            if (!looksLikeApk(apkFile)) {
                setStatus(json("error", pretty));
                return;
            }
            readyVersion = pretty;
            setStatus(json("ready", pretty));
        } catch (Exception err) {
            setStatus(json("error", ""));
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    private void download(String address) throws Exception {
        HttpURLConnection conn = open(address);
        try {
            int code = conn.getResponseCode();
            if (code < 200 || code >= 300) throw new IllegalStateException("download " + code);
            File tmp = new File(apkFile.getAbsolutePath() + ".part");
            InputStream in = conn.getInputStream();
            FileOutputStream out = new FileOutputStream(tmp);
            byte[] buf = new byte[8192];
            int n;
            try {
                while ((n = in.read(buf)) >= 0) out.write(buf, 0, n);
            } finally {
                out.close();
                in.close();
            }
            if (apkFile.exists() && !apkFile.delete()) {
                /* replace below */
            }
            if (!tmp.renameTo(apkFile)) throw new IllegalStateException("save");
        } finally {
            conn.disconnect();
        }
    }

    private void setStatus(String json) {
        statusJson = json;
        activity.runOnUiThread(() -> {
            if (activity.isFinishing() || activity.isDestroyed()) return;
            webView.evaluateJavascript("window.sunnyUpdateChanged&&window.sunnyUpdateChanged()", null);
            offer();
        });
    }

    private void offer() {
        if (activity.isFinishing() || asked || readyVersion.length() == 0) return;
        if (!statusJson.contains("\"ready\"")) return;
        SharedPreferences prefs = activity.getSharedPreferences("sunny-update", 0);
        if (!forceOffer && readyVersion.equals(prefs.getString("skipped", ""))) return;
        forceOffer = false;
        asked = true;
        new AlertDialog.Builder(activity)
                .setTitle("A newer Sunny ABC is ready")
                .setMessage("Version " + readyVersion + " installs over this one. You do not uninstall the old app.")
                .setPositiveButton("Update", (d, w) -> openInstaller())
                .setNegativeButton("Not now", (d, w) -> prefs.edit().putString("skipped", readyVersion).apply())
                .show();
    }

    private void openInstaller() {
        if (!apkFile.exists()) return;
        if (Build.VERSION.SDK_INT >= 26 && !activity.getPackageManager().canRequestPackageInstalls()) {
            Intent settings = new Intent(
                    Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + activity.getPackageName()));
            activity.startActivity(settings);
            return;
        }
        Uri uri = FileProvider.getUriForFile(activity, activity.getPackageName() + ".fileprovider", apkFile);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(uri, "application/vnd.android.package-archive");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        List<ResolveInfo> handlers =
                activity.getPackageManager().queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY);
        int i;
        for (i = 0; i < handlers.size(); i++) {
            activity.grantUriPermission(
                    handlers.get(i).activityInfo.packageName, uri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
        }
        activity.startActivity(intent);
    }

    private String readVersion() {
        try {
            return activity.getPackageManager().getPackageInfo(activity.getPackageName(), 0).versionName;
        } catch (Exception err) {
            return "0";
        }
    }

    private String json(String state, String version) {
        return "{\"state\":\"" + state + "\",\"version\":\"" + version + "\",\"current\":\"" + currentVersion + "\"}";
    }

    private static HttpURLConnection open(String address) throws Exception {
        HttpURLConnection conn = (HttpURLConnection) new URL(address).openConnection();
        conn.setInstanceFollowRedirects(true);
        conn.setConnectTimeout(15000);
        conn.setReadTimeout(120000);
        conn.setRequestProperty("User-Agent", "SunnyABC");
        conn.setRequestProperty("Accept", "application/vnd.github+json");
        return conn;
    }

    private static String read(InputStream in) throws Exception {
        byte[] buf = new byte[4096];
        StringBuilder out = new StringBuilder();
        int n;
        while ((n = in.read(buf)) >= 0) out.append(new String(buf, 0, n, "UTF-8"));
        in.close();
        return out.toString();
    }

    private static boolean looksLikeApk(File file) {
        if (!file.exists() || file.length() < 1000) return false;
        try (InputStream in = new java.io.FileInputStream(file)) {
            return in.read() == 'P' && in.read() == 'K';
        } catch (Exception err) {
            return false;
        }
    }

    static boolean newer(String remote, String local) {
        int[] a = parts(remote);
        int[] b = parts(local);
        int n = Math.max(a.length, b.length);
        int i;
        for (i = 0; i < n; i++) {
            int av = i < a.length ? a[i] : 0;
            int bv = i < b.length ? b[i] : 0;
            if (av != bv) return av > bv;
        }
        return false;
    }

    private static int[] parts(String name) {
        String digits = name.replaceFirst("^[vV]", "").replaceAll("[^0-9.]", "");
        String[] bits = digits.split("\\.");
        int[] out = new int[bits.length];
        int i;
        for (i = 0; i < bits.length; i++) {
            if (bits[i].length() == 0) continue;
            try {
                out[i] = Integer.parseInt(bits[i]);
            } catch (NumberFormatException err) {
                out[i] = 0;
            }
        }
        return out;
    }

    private static String pretty(String tag) {
        String name = tag.replaceFirst("^[vV]", "");
        return name.length() == 0 ? tag : name;
    }
}
