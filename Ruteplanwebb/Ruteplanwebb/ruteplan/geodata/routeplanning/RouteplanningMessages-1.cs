namespace no.vegvesen.routeplanning
{
    
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    [System.Xml.Serialization.XmlRootAttribute("RouteRequest", Namespace="urn:no:vegvesen:geodata:routeplanning:messages:RoutePlanningMessages-1", IsNullable=false)]
    public partial class DetermineRouteRequestType
    {
        
        private RouteInstructionsRequestType itemField;
        
        private bool provideRouteHandleField;
        
        private DistanceUnitType distanceUnitField;
        
        public DetermineRouteRequestType()
        {
            this.provideRouteHandleField = false;
            this.distanceUnitField = DistanceUnitType.M;
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute("RouteInstructionsRequest")]
        public RouteInstructionsRequestType Item
        {
            get
            {
                return this.itemField;
            }
            set
            {
                this.itemField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        [System.ComponentModel.DefaultValueAttribute(false)]
        public bool provideRouteHandle
        {
            get
            {
                return this.provideRouteHandleField;
            }
            set
            {
                this.provideRouteHandleField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        [System.ComponentModel.DefaultValueAttribute(DistanceUnitType.M)]
        public DistanceUnitType distanceUnit
        {
            get
            {
                return this.distanceUnitField;
            }
            set
            {
                this.distanceUnitField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class RouteInstructionsRequestType
    {
        
        private RoutePlanType routePlanField;
        
        private string formatField;
        
        private bool provideGeometryField;
        
        private bool provideBoundingBoxField;
        
        public RouteInstructionsRequestType()
        {
            this.formatField = "text/plain";
            this.provideGeometryField = false;
            this.provideBoundingBoxField = false;
        }
        
        /// <remarks/>
        public RoutePlanType RoutePlan
        {
            get
            {
                return this.routePlanField;
            }
            set
            {
                this.routePlanField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        [System.ComponentModel.DefaultValueAttribute("text/plain")]
        public string format
        {
            get
            {
                return this.formatField;
            }
            set
            {
                this.formatField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        [System.ComponentModel.DefaultValueAttribute(false)]
        public bool provideGeometry
        {
            get
            {
                return this.provideGeometryField;
            }
            set
            {
                this.provideGeometryField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        [System.ComponentModel.DefaultValueAttribute(false)]
        public bool provideBoundingBox
        {
            get
            {
                return this.provideBoundingBoxField;
            }
            set
            {
                this.provideBoundingBoxField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class RoutePlanType
    {
        
        private RoutePreferenceType routePreferenceField;
        
        private WayPointListType wayPointListField;
        
        private bool useRealTimeTrafficField;
        
        private System.DateTime expectedStartTimeField;
        
        private bool expectedStartTimeFieldSpecified;
        
        private System.DateTime expectedEndTimeField;
        
        private bool expectedEndTimeFieldSpecified;
        
        public RoutePlanType()
        {
            this.useRealTimeTrafficField = false;
        }
        
        /// <remarks/>
        public RoutePreferenceType RoutePreference
        {
            get
            {
                return this.routePreferenceField;
            }
            set
            {
                this.routePreferenceField = value;
            }
        }
        
        /// <remarks/>
        public WayPointListType WayPointList
        {
            get
            {
                return this.wayPointListField;
            }
            set
            {
                this.wayPointListField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        [System.ComponentModel.DefaultValueAttribute(false)]
        public bool useRealTimeTraffic
        {
            get
            {
                return this.useRealTimeTrafficField;
            }
            set
            {
                this.useRealTimeTrafficField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public System.DateTime expectedStartTime
        {
            get
            {
                return this.expectedStartTimeField;
            }
            set
            {
                this.expectedStartTimeField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlIgnoreAttribute()]
        public bool expectedStartTimeSpecified
        {
            get
            {
                return this.expectedStartTimeFieldSpecified;
            }
            set
            {
                this.expectedStartTimeFieldSpecified = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public System.DateTime expectedEndTime
        {
            get
            {
                return this.expectedEndTimeField;
            }
            set
            {
                this.expectedEndTimeField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlIgnoreAttribute()]
        public bool expectedEndTimeSpecified
        {
            get
            {
                return this.expectedEndTimeFieldSpecified;
            }
            set
            {
                this.expectedEndTimeFieldSpecified = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public enum RoutePreferenceType
    {
        
        /// <remarks/>
        Fastest,
        
        /// <remarks/>
        Shortest,
        
        /// <remarks/>
        Pedestrian,
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class WayPointListType
    {
        
        private WayPointType startPointField;
        
        private WayPointType[] viaPointField;
        
        private WayPointType endPointField;
        
        /// <remarks/>
        public WayPointType StartPoint
        {
            get
            {
                return this.startPointField;
            }
            set
            {
                this.startPointField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute("ViaPoint")]
        public WayPointType[] ViaPoint
        {
            get
            {
                return this.viaPointField;
            }
            set
            {
                this.viaPointField = value;
            }
        }
        
        /// <remarks/>
        public WayPointType EndPoint
        {
            get
            {
                return this.endPointField;
            }
            set
            {
                this.endPointField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class WayPointType
    {
        
        private PointType _LocationField;
        
        private bool stopField;
        
        public WayPointType()
        {
            this.stopField = true;
        }
        
        /// <remarks/>
        public PointType _Location
        {
            get
            {
                return this._LocationField;
            }
            set
            {
                this._LocationField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        [System.ComponentModel.DefaultValueAttribute(true)]
        public bool stop
        {
            get
            {
                return this.stopField;
            }
            set
            {
                this.stopField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/gml")]
    public partial class PointType : AbstractGeometricPrimitiveType
    {
        
        private DirectPositionType posField;
        
        /// <remarks/>
        public DirectPositionType pos
        {
            get
            {
                return this.posField;
            }
            set
            {
                this.posField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/gml")]
    public partial class DirectPositionType
    {
        
        private string srsNameField;
        
        private string dimensionField;
        
        private double[] textField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute(DataType="anyURI")]
        public string srsName
        {
            get
            {
                return this.srsNameField;
            }
            set
            {
                this.srsNameField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute(DataType="positiveInteger")]
        public string dimension
        {
            get
            {
                return this.dimensionField;
            }
            set
            {
                this.dimensionField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlTextAttribute()]
        public double[] Text
        {
            get
            {
                return this.textField;
            }
            set
            {
                this.textField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.Xml.Serialization.XmlIncludeAttribute(typeof(AbstractGeometryType))]
    [System.Xml.Serialization.XmlIncludeAttribute(typeof(AbstractGeometricPrimitiveType))]
    [System.Xml.Serialization.XmlIncludeAttribute(typeof(PointType))]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/gml")]
    public abstract partial class AbstractGMLType
    {
        
        private string idField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute(Form=System.Xml.Schema.XmlSchemaForm.Qualified, DataType="ID")]
        public string id
        {
            get
            {
                return this.idField;
            }
            set
            {
                this.idField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.Xml.Serialization.XmlIncludeAttribute(typeof(AbstractGeometricPrimitiveType))]
    [System.Xml.Serialization.XmlIncludeAttribute(typeof(PointType))]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/gml")]
    public abstract partial class AbstractGeometryType : AbstractGMLType
    {
        
        private string gidField;
        
        private string srsNameField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string gid
        {
            get
            {
                return this.gidField;
            }
            set
            {
                this.gidField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute(DataType="anyURI")]
        public string srsName
        {
            get
            {
                return this.srsNameField;
            }
            set
            {
                this.srsNameField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.Xml.Serialization.XmlIncludeAttribute(typeof(PointType))]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/gml")]
    public abstract partial class AbstractGeometricPrimitiveType : AbstractGeometryType
    {
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public enum DistanceUnitType
    {
        
        /// <remarks/>
        KM,
        
        /// <remarks/>
        M,
        
        /// <remarks/>
        DM,
        
        /// <remarks/>
        MI,
        
        /// <remarks/>
        YD,
        
        /// <remarks/>
        FT,
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    [System.Xml.Serialization.XmlRootAttribute("RouteResponse", Namespace="urn:no:vegvesen:geodata:routeplanning:messages:RoutePlanningMessages-1", IsNullable=false)]
    public partial class DetermineRouteResponseType
    {
        
        private RouteSummaryType routeSummaryField;
        
        private RouteGeometryType routeGeometryField;
        
        private RouteGeometryType routeGeometrySimpleField;
        
        private RouteInstructionsListType routeInstructionsListField;
        
        private DetermineRouteResponseType[] routeAlternativesField;
        
        private string routeNameField;
        
        /// <remarks/>
        public RouteSummaryType RouteSummary
        {
            get
            {
                return this.routeSummaryField;
            }
            set
            {
                this.routeSummaryField = value;
            }
        }
        
        /// <remarks/>
        public RouteGeometryType RouteGeometry
        {
            get
            {
                return this.routeGeometryField;
            }
            set
            {
                this.routeGeometryField = value;
            }
        }
        
        /// <remarks/>
        public RouteGeometryType RouteGeometrySimple
        {
            get
            {
                return this.routeGeometrySimpleField;
            }
            set
            {
                this.routeGeometrySimpleField = value;
            }
        }
        
        /// <remarks/>
        public RouteInstructionsListType RouteInstructionsList
        {
            get
            {
                return this.routeInstructionsListField;
            }
            set
            {
                this.routeInstructionsListField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlArrayItemAttribute("RouteResponse", IsNullable=false)]
        public DetermineRouteResponseType[] RouteAlternatives
        {
            get
            {
                return this.routeAlternativesField;
            }
            set
            {
                this.routeAlternativesField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string RouteName
        {
            get
            {
                return this.routeNameField;
            }
            set
            {
                this.routeNameField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class RouteSummaryType
    {
        
        private DistanceType totalDistanceField;
        
        private TimeType totalTimeField;
        
        private BoundingBox routeEnvelopeField;
        
        private RouteSummaryTypeAccumulatedProperty[] accumulatedPropertiesField;
        
        /// <remarks/>
        public DistanceType TotalDistance
        {
            get
            {
                return this.totalDistanceField;
            }
            set
            {
                this.totalDistanceField = value;
            }
        }
        
        /// <remarks/>
        public TimeType TotalTime
        {
            get
            {
                return this.totalTimeField;
            }
            set
            {
                this.totalTimeField = value;
            }
        }
        
        /// <remarks/>
        public BoundingBox RouteEnvelope
        {
            get
            {
                return this.routeEnvelopeField;
            }
            set
            {
                this.routeEnvelopeField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlArrayItemAttribute("AccumulatedProperty", IsNullable=false)]
        public RouteSummaryTypeAccumulatedProperty[] AccumulatedProperties
        {
            get
            {
                return this.accumulatedPropertiesField;
            }
            set
            {
                this.accumulatedPropertiesField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class DistanceType
    {
        
        private double valueField;
        
        private DistanceUnitType uomField;
        
        public DistanceType()
        {
            this.uomField = DistanceUnitType.M;
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public double value
        {
            get
            {
                return this.valueField;
            }
            set
            {
                this.valueField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        [System.ComponentModel.DefaultValueAttribute(DistanceUnitType.M)]
        public DistanceUnitType uom
        {
            get
            {
                return this.uomField;
            }
            set
            {
                this.uomField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class TimeType
    {
        
        private double valueField;
        
        private TimeUnitType uomField;
        
        public TimeType()
        {
            this.uomField = TimeUnitType.M;
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public double value
        {
            get
            {
                return this.valueField;
            }
            set
            {
                this.valueField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        [System.ComponentModel.DefaultValueAttribute(TimeUnitType.M)]
        public TimeUnitType uom
        {
            get
            {
                return this.uomField;
            }
            set
            {
                this.uomField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public enum TimeUnitType
    {
        
        /// <remarks/>
        H,
        
        /// <remarks/>
        M,
        
        /// <remarks/>
        S,
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class BoundingBox
    {
        
        private double minxField;
        
        private double minyField;
        
        private double maxxField;
        
        private double maxyField;
        
        private string srsField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public double minx
        {
            get
            {
                return this.minxField;
            }
            set
            {
                this.minxField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public double miny
        {
            get
            {
                return this.minyField;
            }
            set
            {
                this.minyField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public double maxx
        {
            get
            {
                return this.maxxField;
            }
            set
            {
                this.maxxField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public double maxy
        {
            get
            {
                return this.maxyField;
            }
            set
            {
                this.maxyField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string srs
        {
            get
            {
                return this.srsField;
            }
            set
            {
                this.srsField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(AnonymousType=true, Namespace="http://www.opengis.net/xls")]
    public partial class RouteSummaryTypeAccumulatedProperty
    {
        
        private string propertyNameField;
        
        private double valueField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string PropertyName
        {
            get
            {
                return this.propertyNameField;
            }
            set
            {
                this.propertyNameField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public double Value
        {
            get
            {
                return this.valueField;
            }
            set
            {
                this.valueField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class RouteGeometryType
    {
        
        private LineStringType lineStringField;
        
        private ISO_LineString iSO_LineStringField;
        
        private string compressedGeometryField;
        
        /// <remarks/>
        public LineStringType LineString
        {
            get
            {
                return this.lineStringField;
            }
            set
            {
                this.lineStringField = value;
            }
        }
        
        /// <remarks/>
        public ISO_LineString ISO_LineString
        {
            get
            {
                return this.iSO_LineStringField;
            }
            set
            {
                this.iSO_LineStringField = value;
            }
        }
        
        /// <remarks/>
        public string CompressedGeometry
        {
            get
            {
                return this.compressedGeometryField;
            }
            set
            {
                this.compressedGeometryField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class LineStringType
    {
        
        private DirectPositionType1[] posField;
        
        private string srsNameField;
        
        private string idField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute("pos")]
        public DirectPositionType1[] pos
        {
            get
            {
                return this.posField;
            }
            set
            {
                this.posField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string srsName
        {
            get
            {
                return this.srsNameField;
            }
            set
            {
                this.srsNameField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string id
        {
            get
            {
                return this.idField;
            }
            set
            {
                this.idField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(TypeName="DirectPositionType", Namespace="http://www.opengis.net/xls")]
    public partial class DirectPositionType1
    {
        
        private string srsNameField;
        
        private string dimensionField;
        
        private string valueField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute(DataType="anyURI")]
        public string srsName
        {
            get
            {
                return this.srsNameField;
            }
            set
            {
                this.srsNameField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute(DataType="positiveInteger")]
        public string dimension
        {
            get
            {
                return this.dimensionField;
            }
            set
            {
                this.dimensionField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlTextAttribute()]
        public string Value
        {
            get
            {
                return this.valueField;
            }
            set
            {
                this.valueField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class ISO_LineString
    {
        
        private string geometryField;
        
        private string sRSField;
        
        /// <remarks/>
        public string Geometry
        {
            get
            {
                return this.geometryField;
            }
            set
            {
                this.geometryField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string SRS
        {
            get
            {
                return this.sRSField;
            }
            set
            {
                this.sRSField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class RouteInstructionsListType
    {
        
        private RouteInstructionType[] routeInstructionField;
        
        private string langField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute("RouteInstruction")]
        public RouteInstructionType[] RouteInstruction
        {
            get
            {
                return this.routeInstructionField;
            }
            set
            {
                this.routeInstructionField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string lang
        {
            get
            {
                return this.langField;
            }
            set
            {
                this.langField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class RouteInstructionType
    {
        
        private string instructionField;
        
        private string compressedGeometryField;
        
        private maneuverType maneuverTypeField;
        
        private bool maneuverTypeFieldSpecified;
        
        private DistanceType distanceField;
        
        private RouteInstructionTypeAttribute[] attributesField;
        
        private string durationField;
        
        /// <remarks/>
        public string Instruction
        {
            get
            {
                return this.instructionField;
            }
            set
            {
                this.instructionField = value;
            }
        }
        
        /// <remarks/>
        public string CompressedGeometry
        {
            get
            {
                return this.compressedGeometryField;
            }
            set
            {
                this.compressedGeometryField = value;
            }
        }
        
        /// <remarks/>
        public maneuverType ManeuverType
        {
            get
            {
                return this.maneuverTypeField;
            }
            set
            {
                this.maneuverTypeField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlIgnoreAttribute()]
        public bool ManeuverTypeSpecified
        {
            get
            {
                return this.maneuverTypeFieldSpecified;
            }
            set
            {
                this.maneuverTypeFieldSpecified = value;
            }
        }
        
        /// <remarks/>
        public DistanceType distance
        {
            get
            {
                return this.distanceField;
            }
            set
            {
                this.distanceField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlArrayItemAttribute("Attribute", IsNullable=false)]
        public RouteInstructionTypeAttribute[] Attributes
        {
            get
            {
                return this.attributesField;
            }
            set
            {
                this.attributesField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute(DataType="duration")]
        public string duration
        {
            get
            {
                return this.durationField;
            }
            set
            {
                this.durationField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public enum maneuverType
    {
        
        /// <remarks/>
        Unknown,
        
        /// <remarks/>
        Stop,
        
        /// <remarks/>
        Straight,
        
        /// <remarks/>
        BearLeft,
        
        /// <remarks/>
        BearRight,
        
        /// <remarks/>
        TurnLeft,
        
        /// <remarks/>
        TurnRight,
        
        /// <remarks/>
        SharpLeft,
        
        /// <remarks/>
        SharpRight,
        
        /// <remarks/>
        UTurn,
        
        /// <remarks/>
        Ferry,
        
        /// <remarks/>
        Roundabout,
        
        /// <remarks/>
        HighwayMerge,
        
        /// <remarks/>
        HighwayExit,
        
        /// <remarks/>
        HighwayChange,
        
        /// <remarks/>
        ForkCenter,
        
        /// <remarks/>
        ForkLeft,
        
        /// <remarks/>
        ForkRight,
        
        /// <remarks/>
        Depart,
        
        /// <remarks/>
        TripItem,
        
        /// <remarks/>
        EndOfFerry,
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(AnonymousType=true, Namespace="http://www.opengis.net/xls")]
    public partial class RouteInstructionTypeAttribute : RouteInstructionAttribute
    {
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class RouteInstructionAttribute
    {
        
        private string attributeTypeField;
        
        private KeyValuePair[] valuesField;
        
        private Location[] locationsField;
        
        private string idField;
        
        /// <remarks/>
        public string AttributeType
        {
            get
            {
                return this.attributeTypeField;
            }
            set
            {
                this.attributeTypeField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlArrayItemAttribute("Value", IsNullable=false)]
        public KeyValuePair[] Values
        {
            get
            {
                return this.valuesField;
            }
            set
            {
                this.valuesField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlArrayItemAttribute(IsNullable=false)]
        public Location[] Locations
        {
            get
            {
                return this.locationsField;
            }
            set
            {
                this.locationsField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string id
        {
            get
            {
                return this.idField;
            }
            set
            {
                this.idField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class KeyValuePair
    {
        
        private string keyField;
        
        private string valueField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string key
        {
            get
            {
                return this.keyField;
            }
            set
            {
                this.keyField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string value
        {
            get
            {
                return this.valueField;
            }
            set
            {
                this.valueField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.opengis.net/xls")]
    public partial class Location
    {
        
        private double northingField;
        
        private double eastingField;
        
        private string sRSField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public double northing
        {
            get
            {
                return this.northingField;
            }
            set
            {
                this.northingField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public double easting
        {
            get
            {
                return this.eastingField;
            }
            set
            {
                this.eastingField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string SRS
        {
            get
            {
                return this.sRSField;
            }
            set
            {
                this.sRSField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.233")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="urn:no:vegvesen:felles:feiltype:2")]
    [System.Xml.Serialization.XmlRootAttribute("RouteResponseError", Namespace="urn:no:vegvesen:geodata:routeplanning:messages:RoutePlanningMessages-1", IsNullable=false)]
    public partial class SVVFeilType
    {
        
        private string idField;
        
        private string typeField;
        
        private string messageField;
        
        private string stackTraceField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(DataType="normalizedString")]
        public string Id
        {
            get
            {
                return this.idField;
            }
            set
            {
                this.idField = value;
            }
        }
        
        /// <remarks/>
        public string Type
        {
            get
            {
                return this.typeField;
            }
            set
            {
                this.typeField = value;
            }
        }
        
        /// <remarks/>
        public string Message
        {
            get
            {
                return this.messageField;
            }
            set
            {
                this.messageField = value;
            }
        }
        
        /// <remarks/>
        public string StackTrace
        {
            get
            {
                return this.stackTraceField;
            }
            set
            {
                this.stackTraceField = value;
            }
        }
    }
}
