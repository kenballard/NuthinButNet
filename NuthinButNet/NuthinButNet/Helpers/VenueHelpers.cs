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
        private static readonly string ThumbnailFieldName = "thumbnailImage";
        private static readonly string FullSizeFieldName = "fullSizeImage";

        public static MvcHtmlString GetVenueAddress(this IPublishedContent venueNode)
        {
            return MvcHtmlString.Create("");
        }

        public static string GetVenueThumbnailImageUrl(this UmbracoContext context, IPublishedContent venueNode)
        {
            return ImageHelpers.GetImageUrl(context, venueNode, ThumbnailFieldName);
        }

        public static string GetVenueFullSizeImageUrl(this UmbracoContext context, IPublishedContent venueNode)
        {
            return ImageHelpers.GetImageUrl(context, venueNode, FullSizeFieldName);
        }
    }
}