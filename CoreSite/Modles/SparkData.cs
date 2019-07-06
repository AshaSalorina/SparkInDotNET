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

        public class Rating
        {
            public int Numb { get; set; }
            public double Ratings { get; set; }
        }

        public static Dictionary<int, Rating> MoviesRating = new Dictionary<int, Rating>();
        public static Dictionary<string, double> TypeRating = new Dictionary<string, double>();
        public static Dictionary<string, double> JobRating = new Dictionary<string, double>();
        public static Dictionary<string, double> AreaRating = new Dictionary<string, double>();
    }
}