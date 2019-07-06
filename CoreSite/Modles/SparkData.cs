using Microsoft.Spark.Sql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreSite.Modles
{
    public class SparkData
    {
        public static bool Sata { get; set; } = false;

        public static SparkSession Spark { get; set; }
        public static DataFrame Movies { get; set; }
        public static DataFrame Users { get; set; }
        public static DataFrame Ratings { get; set; }

        public static Dictionary<int, double> MoviesRating = new Dictionary<int, double>();
        public static Dictionary<string, double> TypeRating = new Dictionary<string, double>();
    }
}