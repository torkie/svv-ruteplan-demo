using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ruteplanwebb
{
    /// <summary>
    /// Summary description for adress
    /// </summary>
    public class adress : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write("Hello World");
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