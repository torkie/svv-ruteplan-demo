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
            string url = "http://multirit.triona.se/routingService_v1_0/routingService?";
            foreach (var param in context.Request.QueryString.AllKeys)
            {
                url += param + "=" + context.Request.QueryString[param] + "&";
            }
            var wq = WebRequest.Create(url);

            using (var resp = wq.GetResponse())
            {
                using (var respstream = resp.GetResponseStream())
                {
                    if (respstream != null)
                    {
                        
                        var buf = new List<byte>();
                        while (respstream.CanRead)
                        {
                            var b = new byte[8192];
                            int nr = respstream.Read(b, 0, b.Length);
                            buf.AddRange(b.Take(nr));
                            if (nr == 0)
                                break;
                        }

                        //foreach (var h in resp.Headers.AllKeys)
                        //{
                        //    context.Response.Headers.Add(h, resp.Headers[h]);
                       // }
                        context.Response.OutputStream.Write(buf.ToArray(), 0, buf.Count);
                    }

                }
            }
        }

        private class RouteResponse
        {
            public double TotalDistance;
            public double TotalTravelTime;
            public double[] RouteEnvelope;
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