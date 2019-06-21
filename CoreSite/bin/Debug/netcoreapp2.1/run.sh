spark-submit \
--class org.apache.spark.deploy.DotnetRunner \
--master local \
microsoft-spark-2.4.x-0.3.0.jar \
dotnet CoreSite.dll