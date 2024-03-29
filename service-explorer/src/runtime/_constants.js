export default class EsriLookup {
  constructor() {
    this.valueList = {
      "esriNETEdge": "Edge",
      "esriNETJunction": "Junction",
      "esriTDNone": "None",
      "esriTDPartitioned": "Partitioned",
      "esriTDHierarchical": "Hierarchical",
      "esriSCTSource": "Source",
      "esriSCTSink": "Sink",
      "esriTTTRadial": "Radial",
      "esriTTTMesh": "Mesh",
      "esriUNFCUTStructureJunction": "StructureJunction",
      "esriUNFCUTStructureBoundary": "StructureBoundary",
      "esriUNFCUTStructureLine": "StructureLine",
      "esriUNFCUTDevice": "Device",
      "esriUNFCUTAssembly": "Assembly",
      "esriUNFCUTJunction": "Junction",
      "esriUNFCUTLine": "Line",
      "esriUNFCUTSubnetLine": "SubnetLine",
      "esriUNFCUTStructureJunctionObject": "StructureJunctionObject",
      "esriUNFCUTStructureEdgeObject": "StructureEdgeObject",
      "esriUNFCUTJunctionObject": "JunctionObject",
      "esriUNFCUTEdgeObject": "EdgeObject",
      "esriRTJunctionJunction": "Junction Junction Connectivity",
      "esriRTContainment": "Containment",
      "esriRTStructuralAttachment": "Structural Attachment",
      "esriRTJunctionEdge": "Junction Edge Connectivity",
      "esriRTEdgeJunctionEdge": "Edge Junction Edge Connectivity",
      "esriATJunctionJunction": "Junction Junction Connectivity",
      "esriATContainment": "Containment",
      "esriATStructuralAttachment": "Structural Attachment",
      "esriNSSPSupportsContainment": "SupportsContainment",
      "esriNSSPSupportsStructuralAttachments": "SupportsStructuralAttachments",
      "esriNSSPSupportsCategories": "SupportsCategories",
      "esriNSSPSupportsNetworkAttributes": "SupportsNetworkAttributes",
      "esriNSSPSupportsTerminals": "SupportsTerminals",
      "esriNSSPSupportsNone": "SupportsNone",
      "esriADTCascade": "Cascade",
      "esriADTRestricted": "Restricted",
      "esriADTSetToNone": "SetToNone",
      "esriARTNone": "None",
      "esriARTContainer": "Container",
      "esriARTStructure": "Structure",
      "esriNECPEndVertex": "EndVertex",
      "esriNECPAnyVertex": "AnyVertex",
      "esriNADTInteger": "Integer",
      "esriNADTDouble": "Double",
      "esriUNAUTSourceID": "SourceID",
      "esriUNAUTTerminalID": "TerminalID",
      "esriUNAUTAssetGroup": "AssetGroup",
      "esriUNAUTAssetType": "AssetType",
      "esriUNAUTIsSubnetworkController": "IsSubnetworkController",
      "esriUNAUTTierRank": "TierRank",
      "esriUNAUTTierName": "TierName",
      "esriUNAUTShapeLength": "ShapeLength",
      "esriUNAUTPositionFrom": "PositionFrom",
      "esriUNAUTPositionTo": "PositionTo",
      "esriUNAUTFlowDirection": "FlowDirection",
      "esriUNAUTUnknown": "Unknown",
      "esriTSJunctionsAndEdges": "JunctionsAndEdges",
      "esriTSJunctions": "Junctions",
      "esriTSEdges": "Edges",
      "esriCTNetworkAttribute": "NetworkAttribute",
      "esriCTCategory": "Category",
      "esriFTNetworkAttribute": false,
      "esriFTSpecificValue": true,
      "esriCUAnd": false,
      "esriCUOr": true,
      "esriCSPSplit": true,
      "esriCSPDoNotSplit": false,
      "esriTOEqual": "Equal",
      "esriTONotEqual": "NotEqual",
      "esriTOLessThan": "LessThan",
      "esriTOLessThanEqual": "LessThanEqual",
      "esriTOGreaterThan": "GreaterThan",
      "esriTOGreaterThanEqual": "GreaterThanEqual",
      "esriTOIncludesAny": "IncludesAny",
      "esriTODoesNotIncludeAny": "DoesNotIncludeAny",
      "esriTOIncludesTheValues": "IncludesTheValues",
      "esriTODoesNotIncludeTheValues": "DoesNotIncludeTheValues",
      "esriTFTAdd": "Add",
      "esriTFTSubtract": "Subtract",
      "esriTFTCount": "Count",
      "esriTFTAverage": "Average",
      "esriTFTMax": "Max",
      "esriTFTMin": "Min",
      "esriTPFTBitwiseAnd": "BitwiseAnd",
      "esriTPFTMax": "Max",
      "esriTPFTMin": "Min",
      "esriUNTMBidirectional": "Bidirectional",
      "esriUNTMDirectional": "Directional",
      "esriFieldTypeOID": "OID",
      "esriFieldTypeGeometry": "Geometry",
      "esriFieldTypeSmallInteger": "SmallInteger",
      "esriFieldTypeInteger": "Integer",
      "esriFieldTypeSingle": "Single",
      "esriFieldTypeDouble": "Double",
      "esriFieldTypeDate": "Date",
      "esriFieldTypeString": "String",
      "esriFieldTypeBlob": "Blob",
      "esriFieldTypeGUID": "Guid",
      "esriFieldTypeRaster": "Raster",
      "esriFieldTypeGlobalID": "GlobalID",
      "esriFieldTypeXML": "XML",
      "esriARTCalculation": "Calculation",
      "esriARTValidation": "Validation",
      "esriARTConstraint": "Constraint",
      "esriARTEInsert": "Insert",
      "esriARTEUpdate": "Update",
      "esriARTEDelete": "Delete",
      "esriDTCodedValue": "CodedValue",
      "esriDTRange": "Range",
      "esriMPTDefaultValue": "DefaultValue",
      "esriMPTSumValues": "SumValues",
      "esriMPTAreaWeighted": "AreaWeighted",
      "esriSPTDefaultValue": "DefaultValue",
      "esriSPTDuplicate": "Duplicate",
      "esriSPTGeometryRatio": "GeometryRatio",
      "esriGeometryPoint": "Point",
      "esriGeometryPolyline": "Line",
      "esriGeometryPolygon": "Polygon",
      "esriGeometryMultipoint": "Multipoint",
      "esriGeometryMultiPatch": "MultiPath",
      "esriGeometryNull": "Null",
      "esriFTSimple": "Simple",
      "esriFTAnnotation": "Annotation",
      "esriFTDimension": "Dimension",
      "esriDTTable": "Table",
      "esriDTFeatureClass": "FeatureClass",
      "esriDTFeatureDataset": "FeatureDataset",
      "esriDTRelationshipClass": "RelationshipClass",
      "esriDTUtilityNetwork": "UtilityNetwork",
      "esriDTGeometricNetwork": "GeometricNetwork",
      "esriRelCardinalityOneToOne": "OneToOne",
      "esriRelCardinalityOneToMany": "OneToMany",
      "esriRelCardinalityManyToMany": "ManyToMany",
      "esriRelClassKeyClassCode": "ClassCode",
      "esriRelClassKeyClassID": "ClassID",
      "esriRelClassKeyUndefined": "Undefined",
      "esriRelKeyRoleDestinationForeign": "DestinationForeign",
      "esriRelKeyRoleDestinationPrimary": "DestinationPrimary",
      "esriRelKeyRoleOriginForeign": "OriginForeign",
      "esriRelKeyRoleOriginPrimary": "OriginPrimary",
      "esriRelKeyTypeSingle": "Single",
      "esriRelKeyTypeDual": "Dual",
      "esriRelNotificationBackward": "Backward",
      "esriRelNotificationForward": "Forward",
      "esriRelNotificationBoth": "Both",
      "esriRelNotificationNone": "None",
      "esriLocalDatabaseWorkspace": "LocalDatabase",
      "esriRemoteDatabaseWorkspace": "RemoteDatabase"
    };
  }

  lookupValue(value) {
    if (this.valueList.hasOwnProperty(value)) {
      return this.valueList[value];
    } else {
      return value;
    }
  }
}

