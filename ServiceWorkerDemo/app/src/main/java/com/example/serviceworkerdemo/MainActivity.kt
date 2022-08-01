package com.example.serviceworkerdemo

import android.graphics.Bitmap
import android.os.Bundle
import android.util.Log
import android.webkit.*
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView = findViewById<WebView>(R.id.webview)
        webView.settings.javaScriptEnabled = true
        webView.webViewClient = object : WebViewClient() {

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                Log.d("DemoLog", "onPageStarted called with url: ${url}")
                super.onPageStarted(view, url, favicon)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                Log.d("DemoLog", "onPageFinished called with url: ${url}")
                super.onPageFinished(view, url)
            }

            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?
            ): WebResourceResponse? {
                Log.d("DemoLog", "shouldInterceptRequest called with url: ${request?.url}")
                return super.shouldInterceptRequest(view, request)
            }

            override fun onReceivedHttpError(
                view: WebView?,
                request: WebResourceRequest?,
                errorResponse: WebResourceResponse?
            ) {
                Log.d("DemoLog", "onReceivedHttpError called with url: ${request?.url}")
                super.onReceivedHttpError(view, request, errorResponse)
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                Log.d("DemoLog", "onReceivedError called with url: ${request?.url}")
                super.onReceivedError(view, request, error)
            }
        }

        webView.loadUrl("https://serviceworkerplayground.github.io/")
        Log.d("DemoLog", "Loaded page")
    }
}
