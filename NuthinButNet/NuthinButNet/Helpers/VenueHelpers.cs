using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Web.Media;


namespace NuthinButNet.Helpers
{
    public static class VenueHelpers
    {
        public static MvcHtmlString GetVenueAddress(this IPublishedContent venueNode)
        {
            return MvcHtmlString.Create("");
        }
    }
}