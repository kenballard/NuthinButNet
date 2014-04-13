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
        private static readonly string ProgramsAlias = "ProgramsLanding";
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
            var programsRoot = currentNode.Siblings().Single(x => x.DocumentTypeAlias == ProgramsAlias);
            var programs = programsRoot.Children(x => x.IsVisible() && x.DocumentTypeAlias == ProgramAlias);
            return programs.SelectMany(x => x.Children(y => y.DocumentTypeAlias == SubProgramAlias && y.IsVisible()));
        }
    }
}