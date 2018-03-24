using System.IO;
using System.Linq;

namespace vega.Core.Models
{
    public class PhotoSettings
    {
        public int MaxBytes { get; set; }
        public string[] AcceptedFileTypes { get; set; }

        public bool IsSupported(string fileName)
        {
            return AcceptedFileTypes.Any(x => x == Path.GetExtension(fileName).ToLower());
        }
    }
}