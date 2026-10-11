package app.sunnyabc;

import android.annotation.SuppressLint;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MainActivity extends AppCompatActivity {
    private static final String GAME =
            "https://appassets.androidplatform.net/assets/www/index.html";
    private WebView webView;
    private UpdateClient updates;
    private boolean stayLocked;
    private boolean closing;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        stayLocked = lockPrefs().getBoolean("stay", false);
        getWindow().setStatusBarColor(Color.parseColor("#FFF4E4"));
        getWindow().setNavigationBarColor(Color.parseColor("#FFF4E4"));

        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#FFF4E4"));
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.setWebViewClient(new WebViewClientCompat() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri != null && "appassets.androidplatform.net".equals(uri.getHost())) {
                    return false;
                }
                if (uri != null) {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                }
                return true;
            }
        });

        UpdateClient updates = new UpdateClient(this, webView);
        this.updates = updates;
        updates.attach();
        webView.addJavascriptInterface(new LockClient(this), "SunnyLock");

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
            }
        });

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(GAME);
        }
        updates.start();
        if (stayLocked) applyLock();
    }

    public void setKidLock(boolean on) {
        stayLocked = on;
        lockPrefs().edit().putBoolean("stay", on).apply();
        if (on) applyLock();
        else clearLock();
    }

    public void closeApp() {
        closing = true;
        stayLocked = false;
        clearLock();
        finishAndRemoveTask();
    }

    private SharedPreferences lockPrefs() {
        return getSharedPreferences("sunny-lock", MODE_PRIVATE);
    }

    private void applyLock() {
        try {
            startLockTask();
        } catch (RuntimeException ignored) {
        }
        hideBars();
        View decor = getWindow().getDecorView();
        decor.post(this::excludeGestures);
    }

    private void clearLock() {
        try {
            ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
            if (am != null && am.getLockTaskModeState() != ActivityManager.LOCK_TASK_MODE_NONE) {
                stopLockTask();
            }
        } catch (RuntimeException ignored) {
        }
        showBars();
        if (Build.VERSION.SDK_INT >= 29) {
            getWindow().getDecorView().setSystemGestureExclusionRects(Collections.<Rect>emptyList());
        }
    }

    private void hideBars() {
        if (Build.VERSION.SDK_INT >= 30) hideBars30();
        else hideBarsLegacy();
    }

    private void hideBars30() {
        WindowInsetsController controller = getWindow().getInsetsController();
        if (controller == null) return;
        controller.hide(WindowInsets.Type.systemBars());
        controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }

    private void hideBarsLegacy() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }

    private void showBars() {
        if (Build.VERSION.SDK_INT >= 30) showBars30();
        else getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }

    private void showBars30() {
        WindowInsetsController controller = getWindow().getInsetsController();
        if (controller != null) controller.show(WindowInsets.Type.systemBars());
    }

    private void excludeGestures() {
        if (Build.VERSION.SDK_INT < 29 || !stayLocked) return;
        View decor = getWindow().getDecorView();
        int w = decor.getWidth();
        int h = decor.getHeight();
        if (w < 2 || h < 2) return;
        int band = (int) (120 * getResources().getDisplayMetrics().density);
        int side = (int) (24 * getResources().getDisplayMetrics().density);
        List<Rect> rects = new ArrayList<Rect>();
        rects.add(new Rect(0, h - band, w, h));
        rects.add(new Rect(0, 0, side, h));
        rects.add(new Rect(w - side, 0, w, h));
        decor.setSystemGestureExclusionRects(rects);
    }

    private boolean handingOff() {
        return updates != null && updates.isHandingOff();
    }

    private void comeBack() {
        if (closing || !stayLocked || handingOff() || isFinishing()) return;
        try {
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            startActivity(intent);
        } catch (RuntimeException ignored) {
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (updates != null) {
            updates.onHostResume();
            updates.start();
        }
        if (closing) return;
        if (stayLocked && !handingOff()) applyLock();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus && !closing && stayLocked && !handingOff()) applyLock();
    }

    @Override
    protected void onUserLeaveHint() {
        super.onUserLeaveHint();
        comeBack();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) webView.saveState(outState);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
    }
}