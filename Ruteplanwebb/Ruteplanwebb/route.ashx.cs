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

namespace Ruteplanwebb
{
    /// <summary>
    /// Summary description for route
    /// </summary>
    public class Route : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            string url = "http://multirit.triona.se/routingService_v1_0/routingService?" + context.Request.QueryString.ToString();

            var wq = WebRequest.Create(url);

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