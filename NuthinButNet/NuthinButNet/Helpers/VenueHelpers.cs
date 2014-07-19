using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace NuthinButNet.Helpers
{
    public static class VenueHelpers
    {
        private static readonly string VenueRootAlias = "VenueLanding";
        private static readonly string VenueAlias = "Venue";
        private static readonly string ThumbnailFieldName = "thumbnailImage";
        private static readonly string FullSizeFieldName = "fullSizeImage";
        private static readonly string AddressFieldName = "address";

        public static string GetVenueThumbnailImageUrl(this UmbracoContext context, IPublishedContent venueNode)
        {
            return context.GetImageUrl(venueNode, ThumbnailFieldName);
        }

        public static string GetVenueFullSizeImageUrl(this UmbracoContext context, IPublishedContent venueNode)
        {
            return context.GetImageUrl(venueNode, FullSizeFieldName);
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

        public static IEnumerable<IPublishedContent> GetVenues(this IPublishedContent currentNode, int page, int pageSize, bool parksOnly)
        {
            var root = currentNode.AncestorOrSelf(1);
            var venueRoot = root.Siblings()
                .Where(x => x.DocumentTypeAlias == VenueRootAlias && x.IsVisible()).SingleOrDefault();

            var venues = venueRoot.Children(x => x.DocumentTypeAlias == VenueAlias && x.IsVisible());

            return venues.Skip(page * pageSize).Take(pageSize);
        }
    }
}