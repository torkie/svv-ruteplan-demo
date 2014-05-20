using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
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
            var copy = HttpUtility.ParseQueryString(request.QueryString.ToString());

            // get proxy parameters
            var backend_url = copy["backend_url"];
            var backend_username = copy["backend_username"];
            var backend_password = copy["backend_password"];

            // remove parameters that shouldn't be passed to backend
            copy.Remove("backend_url");
            copy.Remove("backend_username");
            copy.Remove("backend_password");

            string url;
            if (String.IsNullOrEmpty(backend_url))
            {
                url = "http://multirit.triona.se/routingService_v1_0/routingService?" + copy.ToString();
            }
            else
            {
                var uri = new Uri(backend_url);
                var hostname = uri.Host;
                var regex = new Regex("(\\.vegvesen\\.no|\\.triona\\.se)$");
                if (regex.IsMatch(hostname)) {
                    url = backend_url + "?" + copy.ToString();
                } else
                {
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    context.Response.End();
                    return;
                }
            }

            var wq = WebRequest.Create(url);

            if (!String.IsNullOrEmpty(backend_username))
            {
                var cred = Encoding.UTF8.GetBytes(backend_username + ":" + backend_password);
                string header = "Basic " + Convert.ToBase64String(cred);
                wq.Headers.Add("Authorization", header);
            }

            using (var resp = wq.GetResponse())
            using (var respstream = resp.GetResponseStream())
            {
                if (respstream != null)
                {
                    respstream.CopyTo(context.Response.OutputStream);
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