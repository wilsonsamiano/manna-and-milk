package app.sunnyabc;

import android.app.ActivityManager;
import android.content.Context;
import android.webkit.JavascriptInterface;

public class LockClient {
    private final MainActivity activity;

    public LockClient(MainActivity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void pinApp() {
        activity.runOnUiThread(() -> activity.setKidLock(true));
    }

    @JavascriptInterface
    public void unpinApp() {
        activity.runOnUiThread(() -> activity.setKidLock(false));
    }

    @JavascriptInterface
    public void closeApp() {
        activity.runOnUiThread(() -> activity.closeApp());
    }

    @JavascriptInterface
    public String pinned() {
        ActivityManager am = (ActivityManager) activity.getSystemService(Context.ACTIVITY_SERVICE);
        if (am == null) return "0";
        return am.getLockTaskModeState() != ActivityManager.LOCK_TASK_MODE_NONE ? "1" : "0";
    }
}
