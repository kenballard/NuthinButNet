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
        private static readonly string AddressFieldName = "address";

        public static string GetVenueThumbnailImageUrl(this UmbracoContext context, IPublishedContent venueNode)
        {
            return ImageHelpers.GetImageUrl(context, venueNode, ThumbnailFieldName);
        }

        public static string GetVenueFullSizeImageUrl(this UmbracoContext context, IPublishedContent venueNode)
        {
            return ImageHelpers.GetImageUrl(context, venueNode, FullSizeFieldName);
        }

        public static MvcHtmlString GetVenueMapUrl(this IPublishedContent venueNode)
        {
            var urlTemplate = "http://maps.google.com/?ie=UTF8&q={0}&spn=41.328535,86.572266&t=m&z={1}&output=embed";
            var address = venueNode.GetPropertyValue<string>(AddressFieldName);
            var zoom = 13;
            return MvcHtmlString.Create(string.Format(urlTemplate, address, zoom));
        }

        public static MvcHtmlString GetAddressFromVenue(this IPublishedContent venueNode)
        {
            var streetAddress = venueNode.GetPropertyValue<string>(AddressFieldName);
            return MvcHtmlString.Create(streetAddress);
        }
    }
}