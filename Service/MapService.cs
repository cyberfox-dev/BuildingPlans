using BuildingPlans.Data;
using BuildingPlans.IServices;
using BuildingPlans.Models.DTO;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class AddResult
{
    public int objectId { get; set; }
    public string globalId { get; set; }
    public bool success { get; set; }
}

public class Root
{
    public AddResult[] addResults { get; set; }
    public object[] updateResults { get; set; }
    public object[] deleteResults { get; set; }

    //The below is for when querying
    public string displayFieldName { get; set; }
    public FieldAliases fieldAliases { get; set; }
    public string geometryType { get; set; }
    public SpatialReference spatialReference { get; set; }
    public List<Field> fields { get; set; }
    public List<Feature> features { get; set; }
}

public class FieldAliases
{
    public string OBJECTID { get; set; }
    // Add other properties as needed
}

public class SpatialReference
{
    public string wkt { get; set; }
    // Add other properties as needed
}

public class Field
{
    public string name { get; set; }
    public string type { get; set; }
    public string alias { get; set; }
    // Add other properties as needed
}

public class Feature
{
    public Attributes attributes { get; set; }
    public Geometry geometry { get; set; }
}

public class Attributes
{
    public int OBJECTID { get; set; }
    // Add other properties as needed
}

public class Geometry
{
    public List<List<List<double>>> paths { get; set; }
    // Add other properties as needed
}

namespace BuildingPlans.Service
{
    public class MapService : IMapService
    {
        private readonly AppDBContext _context;

        public MapService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<List<UserProfileDTO>> ProcessGeometryAsync(object? Geometry, string CreatedByID, string ApplicationID, object? BufferedGeometry, string IsInternal)
        {
            // Check if the geometry object is not null
            if (Geometry != null)
            {
                // Process the geometry and create a MapDTO
                var distributionList = await ProcessGeometryInternalAsync(Geometry, CreatedByID, ApplicationID, BufferedGeometry, IsInternal);
                return distributionList;
            }

            // If the input is null, handle accordingly
            // For now, return null, but you might want to throw an exception or handle it differently
            return null;
        }

        private async Task<List<UserProfileDTO>> ProcessGeometryInternalAsync(object Geometry, string CreatedByID, string ApplicationID, object BufferedGeometry, string IsInternal)
        {

            string jsonBufferedGeometry = BufferedGeometry.ToString();

            var geometryJson1 = JObject.Parse(jsonBufferedGeometry);

            // Extract the spatial reference information from the geometry
            var spatialReference2 = geometryJson1["spatialReference"];

            // Create the 'geometry' part of the 'adds' string dynamically
            //var geometryPart2 = $"\"geometry\": {{\"spatialReference\": {spatialReference2}, \"rings\": {geometryJson1["rings"]}}}";
            //var geometryPart2 = $"\"spatialReference\": {spatialReference2}, \"rings\": {geometryJson1["rings"]}";

            var geometryPart2 = $"{{\"spatialReference\": {spatialReference2}, \"rings\": {geometryJson1["rings"]}}}";


            // Combine 'geometry' and 'attributes' to form the complete 'adds' string
            //var queries = $"[{{ {geometryPart2}, }}]";
            var queries = geometryPart2;

            //Tests
            var testqueries = "{ \"spatialReference\": { \"latestWkid\": 3857, \"wkid\": 102100 }, \"rings\": [ [ [ 2054171.052201044, -4066904.0725966897 ], [ 2054168.2451141614, -4066903.9083498856 ], [ 2054165.475988553, -4066903.417830668 ], [ 2054162.782272121, -4066902.6076725507 ], [ 2054160.2003929603, -4066901.488831661 ], [ 2054157.7652667246, -4066900.076438581 ], [ 2054155.5098244399, -4066898.389593711 ], [ 2054153.4645671626, -4066896.45110897 ], [ 2054151.6571535026, -4066894.287199279 ], [ 2054150.1120255878, -4066891.9271280398 ], [ 2054148.8500785271, -4066889.4028113955 ], [ 2054148.0900227805, -4066887.3923262777 ], [ 2054146.4291687156, -4066882.3350845175 ], [ 2054146.2275249795, -4066881.691148492 ], [ 2054145.5790761292, -4066878.9425134296 ], [ 2054145.2526476267, -4066876.136837629 ], [ 2054145.2526536207, -4066873.3120630938 ], [ 2054145.579093789, -4066870.5063900547 ], [ 2054146.2275533525, -4066867.757760373 ], [ 2054147.189262792, -4066865.103344441 ], [ 2054148.451216451, -4066862.579038523 ], [ 2054149.996348427, -4066860.218979333 ], [ 2054151.8037633647, -4066858.0550824003 ], [ 2054153.8490190357, -4066856.11661048 ], [ 2054156.10445688, -4066854.429777839 ], [ 2054158.5395760387, -4066853.0173957623 ], [ 2054161.1214458244, -4066851.8985640868 ], [ 2054163.8151510423, -4066851.088412913 ], [ 2054166.584264154, -4066850.5978980116 ], [ 2054169.3913378818, -4066850.4336526785 ], [ 2054172.1984116095, -4066850.5978980116 ], [ 2054173.422524905, -4066850.773614624 ], [ 2054180.23391608, -4066851.9306155746 ], [ 2054181.7789303947, -4066852.2454163316 ], [ 2054184.472635887, -4066853.0555675863 ], [ 2054187.054505935, -4066854.174399376 ], [ 2054189.4896253417, -4066855.5867815954 ], [ 2054191.745063415, -4066857.273614406 ], [ 2054193.790319294, -4066859.2120865216 ], [ 2054195.5977344157, -4066861.3759836727 ], [ 2054197.142866549, -4066863.7360431 ], [ 2054198.4048203365, -4066866.2603492714 ], [ 2054199.3665298733, -4066868.9147654707 ], [ 2054200.014989503, -4066871.6633954314 ], [ 2054200.3414297043, -4066874.4690687517 ], [ 2054200.3414356988, -4066877.293843571 ], [ 2054200.0150071625, -4066880.099519657 ], [ 2054199.3665582465, -4066882.848154995 ], [ 2054198.404857893, -4066885.5025789016 ], [ 2054197.1429112647, -4066888.02689469 ], [ 2054195.5977838798, -4066890.386965125 ], [ 2054193.7903708396, -4066892.5508740824 ], [ 2054191.7451142638, -4066894.4893581658 ], [ 2054190.757176942, -4066895.278932884 ], [ 2054185.6066312054, -4066899.1791753494 ], [ 2054184.339135364, -4066900.076438581 ], [ 2054181.9040091287, -4066901.488831661 ], [ 2054179.322129968, -4066902.6076725507 ], [ 2054176.6284135357, -4066903.417830668 ], [ 2054173.8592879276, -4066903.9083498856 ], [ 2054171.052201044, -4066904.0725966897 ] ] ] }";

            //No results
            var testqueries2 = "{ \"spatialReference\": { \"latestWkid\": 3857, \"wkid\": 102100 }, \"rings\": [ [ [ 0, 0 ], [ 0, 5 ], [ 5, 5 ], [ 5, 0 ], [ 0, 0 ] ] ] }";


            var query = new Dictionary<string, string>();


            //query.Add("where", "OBJECTID = 1"); //Used this for testing
            query.Add("f", "json");
            query.Add("geometry", queries); /* Your drawn polygon geometry in JSON format */
            query.Add("geometryType", "esriGeometryPolygon");
            //query.Add("inSR", "3857");
            query.Add("spatialRel", "esriSpatialRelIntersects"); // This specifies that you want to check for intersections
            query.Add("outFields", "OBJECTID");// "*" means you want to retrieve all fields; you can specify specific fields if needed
            query.Add("returnGeometry", "true");// Set to true if you want to get the actual geometries of the features

            //var query = new Dictionary<string, string>
            //{
            //    { "f", "json" },
            //    { "geometry", jsonBufferedGeometry }, /* Your drawn polygon geometry in JSON format */ 
            //    { "geometryType", "esriGeometryPolygon" },
            //    { "inSR", "4326" },
            //    { "spatialRel", "esriSpatialRelIntersects" }, // This specifies that you want to check for intersections
            //    { "outFields", "OBJECTID" }, // "*" means you want to retrieve all fields; you can specify specific fields if needed
            //    { "returnGeometry", "true" } // Set to true if you want to get the actual geometries of the features
            //};



            //Get the type of server the app is installed on. Is it QA or production?
            var ServerType = _context.Config.Where(x => x.ConfigName == "ServerType").Select(x => x.UtilitySlot1).FirstOrDefault();

            //Get infrastructure map
            var infrustructureURL = _context.Config.Where(x => x.ConfigName == "Map" && x.UtilitySlot1 == ServerType && x.UtilitySlot2 == IsInternal && x.UtilitySlot3 == "Infrustructure").Select(x => x.ConfigDescription).FirstOrDefault();

            //Get the zones map: All zones are visible for internal and external - this isn't a security risk apparently.
            var zonesURL = _context.Config.Where(x => x.ConfigName == "Map" && x.UtilitySlot1 == ServerType && x.UtilitySlot2 == IsInternal && x.UtilitySlot3 == "Zones").Select(x => x.ConfigDescription).FirstOrDefault();

            //The Geodatabase
            //var mapServerUrl = "https://esapqa.capetown.gov.za/agsext/rest/services/Theme_Based/Wayleaves/FeatureServer/0";
            var mapServerUrlView = _context.Config.Where(x => x.ConfigName == "Map" && x.UtilitySlot1 == ServerType && x.UtilitySlot2 == IsInternal && x.UtilitySlot3 == "FeatureServer(View)").Select(x => x.ConfigDescription).FirstOrDefault(); ;


            var subDepartmentList = _context.SubDepartmentsTable;

            // Set up the layer in the MapServer to query against
            //var mapServerLayerUrl = new List<string>();
            var exclusionsList = new List<int>();

            //This list will be returned to the interface after firstly populating it with everything and the filtering it based on user interaction/polygon/polyline draw.
            List<UserProfileDTO> distributionList = new List<UserProfileDTO>();

            //Code imported from typescript started here.
            foreach (var subDepartment in subDepartmentList)
            {

                if (subDepartment.isSetForAutomaticDistribution ?? false || subDepartment.SubDepartmentName == "Bulk Water" || subDepartment.SubDepartmentName == "Waste Water and Treatment")
                {

                    var mapLayerID = subDepartment.MapLayerID;
                    var subDepartmentID = subDepartment.SubDepartmentID;
                    var subDepartmentName = subDepartment.SubDepartmentName;
                    var AccessGroupName = "Department Admin";

                    Console.WriteLine(subDepartmentID);

                    //Get ZoneAdminUsers for each SubdepartmentID
                    var zoneAdminUsers = await (
                        from accessGroups in _context.AccessGroups
                        join accessGroupUserLink in _context.AccessGroupUserLink on accessGroups.AccessGroupID equals accessGroupUserLink.AccessGroupID into agul
                        from agulItem in agul.DefaultIfEmpty()
                        join userProfiles in _context.UserProfilesTable on agulItem.UserID equals userProfiles.UserID into up
                        from upItem in up.DefaultIfEmpty()
                        join zonesTable in _context.ZonesTable on upItem.zoneID equals zonesTable.ZoneID into zt
                        from ztItem in zt.DefaultIfEmpty()
                        join subDepartmentTable in _context.SubDepartmentsTable on ztItem.SubDepartmentID equals subDepartmentTable.SubDepartmentID into sdt
                        from sdtItem in sdt.DefaultIfEmpty()
                        where accessGroups.AccessGroupName == AccessGroupName && sdtItem.SubDepartmentID == subDepartmentID
                        select new UserProfileDTO()
                        {
                            UserID = upItem.UserID,
                            FullName = upItem.FullName,
                            Email = upItem.Email,
                            PhoneNumber = upItem.PhoneNumber,
                            Directorate = upItem.Directorate,
                            zoneName = ztItem.ZoneName,
                            MapObjectID = ztItem.MapObjectID,
                            SubDepartmentID = ztItem.SubDepartmentID,
                            zoneID = ztItem.ZoneID,
                            SubDepartmentName = sdtItem.SubDepartmentName,
                            // SubDepartmentID = upItem.SubDepartmentID,
                        }
                    ).ToListAsync();

                    // Assuming zoneAdminUsers is a List<UserProfileDTO>
                    Dictionary<string, bool> seenCombinations = new Dictionary<string, bool>();

                    //Removes duplicates
                    List<UserProfileDTO> tempList = zoneAdminUsers;
                    List<UserProfileDTO> filteredList = tempList
                        .Where(item =>
                        {
                            string key = $"{item.SubDepartmentID}-{item.zoneID}-{item.Email}";

                            if (!seenCombinations.ContainsKey(key))
                            {
                                seenCombinations[key] = true;
                                return true;
                            }

                            return false;
                        })
                        .ToList();

                    zoneAdminUsers = filteredList;

                    if (mapLayerID == null)
                    {
                        //do noting - subdepartments here should be configured with a mapLayerID.
                    }
                    else if (mapLayerID == -1) //// Run code if the department has only a single region, i.e., the entire city is the region. This section can be improved
                    {
                        //Here I've replaced query with BufferedGeometry
                        // Bulk Water
                        var bulkWaterExclusions = await InterceptInfrustructureChecker(subDepartmentName, "Bulk Water", query, 1022, infrustructureURL + "/", new List<int> { 70, 134, 68, 55, 56, 69, 75, 130, 54, 76, 77, 135, 71, 136, 58, 53, 60, 131, 138, 61, 73, 137, 51, 63, 50, 62, 132, 133, 78, 52, 57, 59 });

                        // Join lists
                        exclusionsList.AddRange(bulkWaterExclusions);

                        // Effluent
                        var effluentExclusions = await InterceptInfrustructureChecker(subDepartmentName, "Water Demand Management", query, 1023, infrustructureURL + "/", new List<int> { 100, 101, 102, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114 });

                        // Join lists
                        exclusionsList.AddRange(effluentExclusions);

                        // Send to ALL Admin users in this subdepartment unless excluded as per the lists above.
                        distributionList.AddRange(zoneAdminUsers);

                        // Removes all the excluded departments
                        distributionList = distributionList.Where(item => !exclusionsList.Contains(item.SubDepartmentID ?? 999999999)).ToList(); //Fix this code. I added 999999999 as a patch to resolve the null situation.
                    }
                    else if (mapLayerID > -1)
                    {

                        var queryZones = new Dictionary<string, string>();


                        //query.Add("where", "OBJECTID = 1"); //Used this for testing
                        queryZones.Add("f", "json");
                        queryZones.Add("geometry", queries); /* Your drawn polygon geometry in JSON format */
                        queryZones.Add("geometryType", "esriGeometryPolygon");
                        //queryZones.Add("inSR", "3857");
                        queryZones.Add("spatialRel", "esriSpatialRelIntersects"); // This specifies that you want to check for intersections
                        queryZones.Add("outFields", "*");// "*" means you want to retrieve all fields; you can specify specific fields if needed
                        queryZones.Add("returnGeometry", "true");// Set to true if you want to get the actual geometries of the features

                        HttpClient client2 = new HttpClient();

                        // Encode the payload for the POST request
                        var encodedPayload = new FormUrlEncodedContent(queryZones); //Can use the same query because it's just being used on different layers (zone layers as opposed to infrustructure layers).

                        // Set up the layer in the MapServer to query against
                        var mapServerLayerUrl = zonesURL + "/" + mapLayerID + "/query";

                        try
                        {
                            // Make the POST request
                            var response = client2.PostAsync(mapServerLayerUrl, encodedPayload).Result;
                            response.EnsureSuccessStatusCode();  // This will throw an exception for non-success status codes

                            var responseString2 = response.Content.ReadAsStringAsync().Result;

                            // Parse the response JSON
                            var responseObject2 = JsonConvert.DeserializeObject<Root>(responseString2);

                            if (responseObject2.features != null && responseObject2.features.Any())
                            {

                                var features = responseObject2.features;

                                foreach (var feature in features)
                                {

                                    var objectID = feature.attributes.OBJECTID;

                                    var filteredList2 = zoneAdminUsers.Where(obj => obj.MapObjectID == objectID && obj.SubDepartmentID == subDepartmentID).ToList();

                                    distributionList.AddRange(filteredList2);

                                    // Removes all the excluded departments
                                    distributionList = distributionList.Where(item => !exclusionsList.Contains(item.SubDepartmentID ?? 999999999)).ToList();
                                }

                            }
                            else
                            {

                            }

                        }
                        catch (HttpRequestException ex)
                        {
                            Console.WriteLine($"Request failed: {ex.Message}");
                        }

                    }
                    else
                    {
                        // Handle unexpected cases
                    }

                    Console.WriteLine(distributionList);
                }
                else
                {
                    // Do not distribute to this department
                }
            }

            // Continue with the rest of the code...

            //return Ok("Processing complete");
            //Code imported from frontend ends here.


            // Process the geometry and create a MapDTO
            // Example: var processedResult = await SomeProcessingMethodForGeometryAsync(geometry);

            //Save to the geodatabase

            //Test ven: https://community.esri.com/t5/arcgis-rest-apis-and-services-questions/how-to-post-to-arcgis-rest-api-for-apply-edits/td-p/1059907

            var attributes = new
            {
                LU_ACTV_STS = 1,
                CRTD_BY_ID = CreatedByID,
                WLMS_APLC_KEY = ApplicationID
            };

            // Assuming 'geometry' is the object received from the client
            var geometryString = Geometry.ToString();
            var geometryJson2 = JObject.Parse(geometryString);

            // Extract the spatial reference information from the geometry
            var spatialReference = geometryJson2["spatialReference"];

            // Determine the geometry type
            string geometryType = GetGeometryType(geometryJson2);

            string geometryPart;
            string mapServerUrl;

            if (geometryType == "polygon")
            {
                // For polygons
                // Create the 'geometry' part of the 'adds' string dynamically
                geometryPart = $"\"geometry\": {{\"spatialReference\": {spatialReference}, \"rings\": {geometryJson2["rings"]}}}";
                mapServerUrl = _context.Config.Where(x => x.ConfigName == "Map" && x.UtilitySlot1 == ServerType && x.UtilitySlot2 == IsInternal && x.UtilitySlot3 == "FeatureServer(Edit)").Select(x => x.ConfigDescription).FirstOrDefault(); ;

            }
            else if (geometryType == "polyline")
            {
                // For polylines
                geometryPart = $"\"geometry\": {{\"spatialReference\": {spatialReference}, \"paths\": {geometryJson2["paths"]}}}";
                mapServerUrl = _context.Config.Where(x => x.ConfigName == "Map" && x.UtilitySlot1 == ServerType && x.UtilitySlot2 == IsInternal && x.UtilitySlot3 == "FeatureServerLine(Edit)").Select(x => x.ConfigDescription).FirstOrDefault(); ;

            }
            else
            {
                // Handle other geometry types or throw an exception
                throw new NotSupportedException($"Unsupported geometry type: {geometryType}");
            }

            // Construct the complete URL for applyEdits
            var url = $"{mapServerUrl}/applyEdits";

            // Assuming 'attributes' is the object containing IsActive, CREATED_BYid, and WLMS_APLC_KEY
            var attributesString = JsonConvert.SerializeObject(attributes);

            // Create the 'attributes' part of the 'adds' string
            var attributesPart = $"\"attributes\": {attributesString}";

            // Combine 'geometry' and 'attributes' to form the complete 'adds' string
            var adds = $"[{{ {geometryPart}, {attributesPart} }}]";

            var inputParms = new Dictionary<string, string>();
            inputParms.Add("adds", adds);
            //inputParms.Add("updates", "");
            //inputParms.Add("deletes", "");
            //inputParms.Add("attachments", "");
            inputParms.Add("f", "json");
            //inputParms.Add("token", "");

            var input = new FormUrlEncodedContent(inputParms);

            HttpClient client = new HttpClient();

            var response2 = client.PostAsync(url, input).Result;
            var responseString = response2.EnsureSuccessStatusCode().Content.ReadAsStringAsync().Result;

            // Deserialize JSON
            Root responseObject = JsonConvert.DeserializeObject<Root>(responseString);

            // Access the "success" property
            bool successValue = responseObject.addResults[0].success;

            return distributionList;
        }

        private async Task<List<int>> InterceptInfrustructureChecker(string currentSubDepartmentName, string subDepartmentContainingInfrustructure, Dictionary<string, string> query, int exclusionUponInterception, string baseURL, List<int> numbers)
        {
            // Initialize variables
            var numOfInterceptions = 0;
            var exclusionsList = new List<int>();
            var countNumber = numbers.Count;
            var layerURLs = numbers.Select(number => $"{baseURL}{number}/query").ToList();



            async Task CheckInterceptionsAsync(int index)
            {

                //If the number of interceptions is 1 or more, it stops processing any more layers
                if (index >= layerURLs.Count || numOfInterceptions >= 1)
                {
                    // All layers have been checked or an interception has already been found, resolve with the final exclusionsList
                    // or stop checking if an interception has already been found
                    return;
                }

                HttpClient client = new HttpClient();

                // Encode the payload for the POST request
                var encodedPayload = new FormUrlEncodedContent(query);

                var layerURL = layerURLs[index];
                //layerURL += string.Join("&", query.Select(p => $"{p.Key}={Uri.EscapeDataString(p.Value)}"));

                try
                {
                    // Make the POST request
                    var response = client.PostAsync(layerURL, encodedPayload).Result;
                    response.EnsureSuccessStatusCode();  // This will throw an exception for non-success status codes

                    var responseString = response.Content.ReadAsStringAsync().Result;

                    // Parse the response JSON
                    var responseObject = JsonConvert.DeserializeObject<Root>(responseString);

                    if (responseObject.features != null && responseObject.features.Any())
                    {
                        // Features are present, indicating an intersection
                        numOfInterceptions += responseObject.features.Count;

                        if (numOfInterceptions >= 1)
                        {
                            // Remove the exclusionUponInterception from the exclusions list
                            exclusionsList.Remove(exclusionUponInterception);
                        }
                        else
                        {
                            // Remove the subdepartment first to prevent duplication of exclusions
                            exclusionsList.Remove(exclusionUponInterception);
                            // Exclude the subdepartment upon interception
                            exclusionsList.Add(exclusionUponInterception);
                        }

                        Console.WriteLine("Intersection detected!");
                    }
                    else
                    {
                        // No features, indicating no intersection
                        // Remove the subdepartment first to prevent duplication of exclusions
                        exclusionsList.Remove(exclusionUponInterception);
                        // Exclude the subdepartment upon interception
                        exclusionsList.Add(exclusionUponInterception);

                        Console.WriteLine("No intersection detected.");
                    }

                    // Continue with the next layer
                    await CheckInterceptionsAsync(index + 1);
                }
                catch (HttpRequestException ex)
                {
                    Console.WriteLine($"Request failed: {ex.Message}");
                }

            }

            // Start checking interceptions
            await CheckInterceptionsAsync(0);

            // Return the final exclusionsList
            return exclusionsList;
        }

        private string GetGeometryType(JObject geometryJson)
        {
            if (geometryJson["paths"] != null)
            {
                return "polyline";
            }
            else if (geometryJson["rings"] != null)
            {
                return "polygon";
            }
            else
            {
                // Handle other geometry types or throw an exception
                throw new NotSupportedException("Unsupported geometry type: The 'paths' or 'rings' property is missing.");
            }
        }


    }
}