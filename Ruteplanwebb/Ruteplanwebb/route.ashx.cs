using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Security.Cryptography.X509Certificates;
using System.Web.UI;
using System.Globalization;
using System.Net;
using System.Web;
using System.Web.Script.Serialization;
using System.Xml.Serialization;
using System.Text.RegularExpressions;
using System.Text;

namespace Ruteplanwebb
{
    /// <summary>
    /// Summary description for route
    /// </summary>
    public class Route : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            var request = context.Request;

            // kinda a hack to copy request.QueryString so we get a mutable instance
            var queryString = HttpUtility.ParseQueryString(request.QueryString.ToString());

            // get proxy parameters
            var backend_url = queryString["backend_url"];
            var backend_username = queryString["backend_username"];
            var backend_password = queryString["backend_password"];

            // remove parameters that shouldn't be passed to backend
            queryString.Remove("backend_url");
            queryString.Remove("backend_username");
            queryString.Remove("backend_password");

            string url;
            if (String.IsNullOrEmpty(backend_url))
            {
                url = "http://multirit.triona.se/routingService_v1_0/routingService?" + queryString.ToString();
            }
            else
            {
                var uri = new Uri(backend_url);
                var hostname = uri.Host;
                // "security check"
                var regex = new Regex("(\\.vegvesen\\.no|\\.triona\\.se)$");
                if (regex.IsMatch(hostname))
                {
                    url = backend_url + (!backend_url.EndsWith("?", StringComparison.Ordinal) ? "?" : "") + queryString;
                }
                else
                {
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    context.Response.End();
                    return;
                }
            }

            var wq = WebRequest.Create(url) as HttpWebRequest;
            // add basic auth header if we have username
            if (!String.IsNullOrEmpty(backend_username))
            {
                wq.PreAuthenticate = true;
                wq.Credentials = new NetworkCredential(backend_username, backend_password);
            }

            using (var resp = wq.GetResponse())
            {
                using (var respstream = resp.GetResponseStream())
                {
                    if (respstream != null)
                    {
                        respstream.CopyTo(context.Response.OutputStream);
                    }
                }
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}