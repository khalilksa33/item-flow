using System;
using System.IO;
using System.Windows.Forms;
using Microsoft.Web.WebView2.WinForms;

namespace KamySoftInstaller
{
    public class Form1 : Form
    {
        private WebView2 webView;

        public Form1()
        {
            this.Text = "KamySoft";
            this.Width = 1024;
            this.Height = 768;
            InitializeWebView();
        }

        private async void InitializeWebView()
        {
            webView = new WebView2
            {
                Dock = DockStyle.Fill
            };
            this.Controls.Add(webView);

            // Ensure WebView2 runtime is installed; otherwise it will prompt.
            await webView.EnsureCoreWebView2Async();

            // Determine path to the built web assets (dist folder).
            string exeDir = AppDomain.CurrentDomain.BaseDirectory;
            string indexPath = Path.Combine(exeDir, "dist", "index.html");
            if (!File.Exists(indexPath))
            {
                MessageBox.Show($"Unable to locate web assets at {indexPath}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }
            // Use file URI to load local page.
            webView.Source = new Uri(indexPath);
        }
    }
}
