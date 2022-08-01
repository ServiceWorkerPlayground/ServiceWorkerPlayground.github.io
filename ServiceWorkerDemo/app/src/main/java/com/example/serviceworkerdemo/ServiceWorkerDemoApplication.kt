package com.example.serviceworkerdemo

import android.app.Application
import android.webkit.WebView

class ServiceWorkerDemoApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        WebView.setWebContentsDebuggingEnabled(true)
    }
}
