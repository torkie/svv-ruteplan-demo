// --------------------------------------------------------------------------------------------------------------------
// <copyright file="route.ashx.cs" company="Triona AB">
//   Copyright (c) Triona AB. All rights reserved.
// </copyright>
// <summary>
//   Summary description for route
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Ruteplanwebb
{
    using System;
    using System.Configuration;
    using System.Net;
    using System.Text.RegularExpressions;
    using System.Web;

    /// <summary>
    /// The route.
    /// </summary>
    public class Route : BaseProxy, IHttpHandler
    {
        /// <summary>
        /// Gets a value indicating whether is reusable.
        /// </summary>
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        /// <summary>
        /// The process request.
        /// </summary>
        /// <param name="context">
        /// The context.
        /// </param>
        public void ProcessRequest(HttpContext context)
        {
            var request = context.Request;

            // kinda a hack to copy request.QueryString so we get a mutable instance
            var queryString = HttpUtility.ParseQueryString(request.QueryString.ToString());

            // get proxy parameters
            var backendUrl = queryString["backend_url"];
            var backendUsername = queryString["backend_username"];
            var backendPassword = queryString["backend_password"];

            // remove parameters that shouldn't be passed to backend
            queryString.Remove("backend_url");
            queryString.Remove("backend_username");
            queryString.Remove("backend_password");

            string url;
            if (string.IsNullOrEmpty(backendUrl))
            {
                url = ConfigurationManager.AppSettings.Get("RouterBackendUrl") + queryString;
            }
            else
            {
                var uri = new Uri(backendUrl);
                var hostname = uri.Host;

                // "security check"
                var regex = new Regex("(\\.vegvesen\\.no|\\.triona\\.se)$");
                if (regex.IsMatch(hostname))
                {
                    url = backendUrl + (!backendUrl.EndsWith("?", StringComparison.Ordinal) ? "?" : string.Empty) + queryString;
                }
                else
                {
                    context.Response.StatusCode = (int) HttpStatusCode.BadRequest;
                    context.Response.End();
                    return;
                }
            }

            ProxyRequest(context, url, backendUsername, backendPassword);
        }
    }

    /// <summary>
    /// The wms proxy.
    /// </summary>
    public class WmsProxy : BaseProxy, IHttpHandler
    {

        /// <summary>
        /// Gets a value indicating whether is reusable.
        /// </summary>
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        /// <summary>
        /// The process request.
        /// </summary>
        /// <param name="context">
        /// The context.
        /// </param>
        /// <exception cref="NotSupportedException">
        /// </exception>
        public void ProcessRequest(HttpContext context)
        {
            var request = context.Request;
            
            // kinda a hack to copy request.QueryString so we get a mutable instance
            var queryString = HttpUtility.ParseQueryString(request.QueryString.ToString());

            // get proxy parameters
            var backendUrl = queryString["url"];
            var backendUsername = queryString["backend_username"];
            var backendPassword = queryString["backend_password"];

            // remove parameters that shouldn't be passed to backend
            queryString.Remove("url");
            queryString.Remove("backend_username");
            queryString.Remove("backend_password");

            if (string.IsNullOrEmpty(backendUrl))
            {
                throw new NotSupportedException("No URL Given");
            }

            var url = backendUrl + (!backendUrl.EndsWith("?", StringComparison.Ordinal) ? "?" : string.Empty)
                         + "REQUEST=GetCapabilities&SERVICE=WMS";

            ProxyRequest(context, url, backendUsername, backendPassword);
        }
    }

    /// <summary>
    /// The base proxy.
    /// </summary>
    public class BaseProxy
    {
        /// <summary>
        /// The proxy request.
        /// </summary>
        /// <param name="context">
        /// The context.
        /// </param>
        /// <param name="url">
        /// The url.
        /// </param>
        /// <param name="backendUsername">
        /// The backend username.
        /// </param>
        /// <param name="backendPassword">
        /// The backend password.
        /// </param>
        public static void ProxyRequest(HttpContext context, string url, string backendUsername, string backendPassword)
        {
            var wq = WebRequest.Create(url) as HttpWebRequest;
            
            // add basic auth header if we have username
            if (!string.IsNullOrEmpty(backendUsername))
            {
                if (wq != null)
                {
                    wq.PreAuthenticate = true;
                    wq.Credentials = new NetworkCredential(backendUsername, backendPassword);
                }
            }

            if (wq == null)
            {
                return;
            }

            using (var resp = wq.GetResponse())
            {
                context.Response.ContentType = resp.ContentType;
                using (var respstream = resp.GetResponseStream())
                {
                    if (respstream != null)
                    {
                        respstream.CopyTo(context.Response.OutputStream);
                    }
                }
            }
        }
    }
}