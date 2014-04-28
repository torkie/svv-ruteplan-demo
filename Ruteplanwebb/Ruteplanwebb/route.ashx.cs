using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Xml.Serialization;
using no.vegvesen.routeplanning;

namespace Ruteplanwebb
{
    /// <summary>
    /// Summary description for route
    /// </summary>
    public class Route : IHttpHandler
    {

        private static XmlSerializer m_serializer = new XmlSerializer(typeof (no.vegvesen.routeplanning.DetermineRouteResponseType));

        public void ProcessRequest(HttpContext context)
        {
            string fromX = context.Request.QueryString["fromx"];
            string fromY = context.Request.QueryString["fromy"];
            string toX = context.Request.QueryString["tox"];
            string toY = context.Request.QueryString["toy"];

            RouteResponse ret = null;

            var wq =
                WebRequest.Create(
                    string.Format(CultureInfo.InvariantCulture,
                        "http://multirit.triona.se/routingService_v1_0/routingService?stops={0},{1};{2},{3}&returnDirections=true&returnGeometry=true&format=xml",
                        fromX, fromY, toX, toY));

            using (var resp = wq.GetResponse())
            {
                using (var respstream = resp.GetResponseStream())
                {
                    var rret = m_serializer.Deserialize(respstream) as DetermineRouteResponseType;
                    if (rret != null)
                    {
                        ret = new RouteResponse();
                        ret.TotalTravelTime = rret.RouteSummary.TotalTime.value;
                        ret.TotalDistance = rret.RouteSummary.TotalDistance.value;
                        ret.RouteEnvelope = new[]
                        {
                            rret.RouteSummary.RouteEnvelope.minx, rret.RouteSummary.RouteEnvelope.miny, rret.RouteSummary.RouteEnvelope.maxx,
                            rret.RouteSummary.RouteEnvelope.maxy
                        };
                    }
                }

            }


            context.Response.ContentType = "application/json";

            JavaScriptSerializer ser = new JavaScriptSerializer();
            context.Response.Write(ser.Serialize(ret));
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