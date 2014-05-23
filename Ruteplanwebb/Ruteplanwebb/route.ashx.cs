using System;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;

namespace Ruteplanwebb
{
    /// <summary>
    /// Summary description for route
    /// </summary>
    public class Route : BaseProxy, IHttpHandler
    {
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
            if (String.IsNullOrEmpty(backendUrl))
            {
                url = "http://multirit.triona.se/routingService_v1_0/routingService?" + queryString;
            }
            else
            {
                var uri = new Uri(backendUrl);
                var hostname = uri.Host;
                // "security check"
                var regex = new Regex("(\\.vegvesen\\.no|\\.triona\\.se)$");
                if (regex.IsMatch(hostname))
                {
                    url = backendUrl + (!backendUrl.EndsWith("?", StringComparison.Ordinal) ? "?" : "") + queryString;
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

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

    public class WmsProxy : BaseProxy, IHttpHandler
    {
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

            string url;
            if (String.IsNullOrEmpty(backendUrl))
            {
                throw new NotSupportedException("No URL Given");
            }


            url = backendUrl + (!backendUrl.EndsWith("?", StringComparison.Ordinal) ? "?" : "") + "REQUEST=GetCapabilities&SERVICE=WMS";

            ProxyRequest(context, url, backendUsername, backendPassword);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

    public class BaseProxy
    {
        public static void ProxyRequest(HttpContext context, string url, string backendUsername, string backendPassword)
        {
            var wq = WebRequest.Create(url) as HttpWebRequest;
            // add basic auth header if we have username
            if (!String.IsNullOrEmpty(backendUsername))
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