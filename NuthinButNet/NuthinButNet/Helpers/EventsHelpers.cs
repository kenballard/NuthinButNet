using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace NuthinButNet.Helpers
{
    public static class EventsHelpers
    {
        private static readonly string EventRootAlias = "EventLanding";
        private static readonly string EventAlias = "Event";
        private static readonly string DateTimeFieldName = "dateTime";
        private static readonly string FeaturedFieldName = "featured";

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
                .Where(x => x.GetPropertyValue<DateTime>(DateTimeFieldName) >= DateTime.Today)
                .OrderBy(x => x.GetPropertyValue<DateTime>(DateTimeFieldName));

            return results;
        }

        public static IEnumerable<IPublishedContent> GetFeaturedEvents(this IPublishedContent currentNode, int maximum)
        {
            var results = GetAllEvents(currentNode)
                .Where(x => x.GetPropertyValue<DateTime>(DateTimeFieldName) >= DateTime.Today)
                .OrderBy(x => x.GetPropertyValue<bool>(FeaturedFieldName))
                .OrderBy(x => x.GetPropertyValue<DateTime>(DateTimeFieldName))
                .Take(maximum);

            return results;
        }
    }
}