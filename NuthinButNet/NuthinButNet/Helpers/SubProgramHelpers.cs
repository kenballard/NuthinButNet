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
    public static class SubProgramHelpers
    {
        private static readonly string ProgramAlias = "Program";
        private static readonly string SubProgramAlias = "SubProgram";
        private static readonly string NameField = "name";

        public static MvcHtmlString GetSubProgramName(this IPublishedContent subProgramNode)
        {
            var name = subProgramNode.GetPropertyValue<string>(NameField);
            return MvcHtmlString.Create(name);
        }

        public static IEnumerable<IPublishedContent> GetAllSubPrograms(this IPublishedContent currentNode)
        {
            var root = currentNode.AncestorOrSelf(1);
            var programs = root.Siblings().Where(x => x.DocumentTypeAlias == ProgramAlias);
            var subPrograms = new List<IPublishedContent>();

            foreach (var p in programs)
            {
                subPrograms.AddRange(p.Descendants());
            }

            return subPrograms;
        }
    }
}