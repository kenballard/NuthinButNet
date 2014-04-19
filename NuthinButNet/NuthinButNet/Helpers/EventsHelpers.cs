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
    public static class EventsHelpers
    {
        private static readonly string EventRootAlias = "EventLanding";
        private static readonly string EventAlias = "Event";
        private static readonly string DateTimeStartFieldName = "dateTime";
        private static readonly string DateTimeEndFieldName = "dateTimeEnd";
        private static readonly string FeaturedFieldName = "featured";
        private static readonly string ThumbnailFieldName = "thumbnailImage";
        private static readonly string FullSizeFieldName = "fullSizeImage";
        private static readonly string VenueFieldName = "";

        public static IPublishedContent GetRootNode(this IPublishedContent currentNode)
        {
            return currentNode.AncestorOrSelf(1);
        }

        public static IPublishedContent GetEventsRoot(this IPublishedContent currentNode)
        {
            return GetRootNode(currentNode).Siblings()
                .Where(x => x.DocumentTypeAlias == EventRootAlias && x.IsVisible())
                .SingleOrDefault();
        }

        public static IEnumerable<IPublishedContent> GetAllEvents(this IPublishedContent currentNode)
        {
            return GetEventsRoot(currentNode).Children(x => x.DocumentTypeAlias == EventAlias);
        }

        public static IEnumerable<IPublishedContent> GetUpcomingEvents(this IPublishedContent currentNode)
        {
            var results = GetAllEvents(currentNode)
                .Where(x => x.GetPropertyValue<DateTime>(DateTimeStartFieldName) >= DateTime.Today)
                .OrderBy(x => x.GetPropertyValue<DateTime>(DateTimeStartFieldName));

            return results;
        }

        public static IEnumerable<IPublishedContent> GetFeaturedEvents(this IPublishedContent currentNode, int maximum)
        {
            var results = GetAllEvents(currentNode)
                .Where(x => x.GetPropertyValue<DateTime>(DateTimeStartFieldName) >= DateTime.Today)
                .OrderBy(x => x.GetPropertyValue<bool>(FeaturedFieldName))
                .OrderBy(x => x.GetPropertyValue<DateTime>(DateTimeStartFieldName))
                .Take(maximum);

            return results;
        }

        public static string GetEventThumbnailUrl(this UmbracoContext context, IPublishedContent eventNode)
        {
            return GetImageUrl(context, eventNode, ThumbnailFieldName);
        }

        public static string GetEventFullSizeImageUrl(this UmbracoContext context, IPublishedContent eventNode)
        {
            return GetImageUrl(context, eventNode, FullSizeFieldName);
        }

        public static string GetFormattedEventDate(this IPublishedContent eventNode)
        {
            //25 - 02 - 2013
            var start = eventNode.GetPropertyValue<DateTime>(DateTimeStartFieldName);
            var end = eventNode.GetPropertyValue<DateTime>(DateTimeEndFieldName);

            if (DateTime.MinValue < end)
            {
                return string.Format("{0} - {1}", start.ToShortDateString(), end.ToShortDateString());
            }

            return start.ToShortDateString();
        }

        public static string GetFormattedEventTime(this IPublishedContent eventNode)
        {
            //08:00am - 12:00pm
            var start = eventNode.GetPropertyValue<DateTime>(DateTimeStartFieldName);
            var end = eventNode.GetPropertyValue<DateTime>(DateTimeEndFieldName);

            if (DateTime.MinValue < end)
            {
                return string.Format("{0} - {1}", start.ToShortTimeString(), end.ToShortTimeString());
            }

            return start.ToShortTimeString();
        }

        public static MvcHtmlString GetFormattedAddress(this UmbracoContext context, IPublishedContent eventNode)
        {
            // TODO: Get venue address
            return MvcHtmlString.Create("Washington, United States");
        }

        private static string GetImageUrl(this UmbracoContext context, IPublishedContent eventNode, string propertyName)
        {
            var helper = new UmbracoHelper(context);
            var imageId = eventNode.GetPropertyValue<int>(propertyName);
            var typedMedia = helper.TypedMedia(imageId);
            return typedMedia.Url;
        }
    }
}