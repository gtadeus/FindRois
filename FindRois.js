importClass(Packages.ij.plugin.filter.GaussianBlur);
function setUpperThreshold(imp, Threshold)
{
	var stats = imp.getStatistics();
//IJ.log(parseFloat(stats.mean));	
	var ip = imp.getProcessor().convertToFloat()
	var pixels = ip.getPixels()   
	var stats = imp.getStatistics();
	IJ.log(parseFloat(stats.mean));	

	for (var i = 0; i < pixels.length; i++)
	{
		if (pixels[i] > Threshold)
		{
			//pixels[i] = parseFloat(stats.mean);
			pixels[i] = 100;
		}				
	}
	
	imp= ImagePlus("test", ip)  

	var stats = imp.getStatistics();
	//IJ.log(parseFloat(stats.mean));	
}

var rm = new RoiManager(false);
rm = RoiManager.getInstance();
var error = false;
if (rm == null)
{
	error = true;
	IJ.error( "ERROR! Please open ROI manager!");
}

//*******************User Settings*********************

var stimulationFrame = 10;

var floatNoiseThreshold = 0;
var blurRadius = 0.6;
var startImg = 2;
var endImg = 5;
var MaximumFinderNoiseThreshold = 200;
//var blurRoiRadius = 2;
var PAminSize = 15;
var PAmaxSize = 1000;
var PAminCirc = 0.7;
var PAmaxCirc = 1.0;
var AverageImageGaussianBlur = 2.5;
var timesDilate = 3;
var areaMultiply = 1.0;
var centerThreshold = 0;
var saturated = 1;
var minManThreshold = 0;
var maxManThreshold = 20000;
var brightNeuronThreshold = 200;

var gaussianBlur = true;
var maskBrightNeurons = false;
var rectangleRois = true;
var Watershed = true;
var sqrEnhance = false;
var LinearNoiseSubstract = true;
var showEnhnancedDifferenceImage = false;
var showThresholdImage = false;
var showAverageImage = false;
var autoSaveRois = false;
var maxEnhImagePlus = true;
var enhContr = false;
var enhanceContrastAvgImage = false;
var manTreshold = false;
var absImage = true;
var runParticleAnalyzer = true;
var MinimumThreshold = false;
//*******************************************************

var gd = new GenericDialog("ROI finderSettings");
gd.addMessage("**symmetric median project window around stimulation frame:");
//gd.addNumericField("Linear Noise Offset: ", floatNoiseThreshold, 2);
//gd.addNumericField("blur radius for calculating difference image: ", blurRadius, 2);
gd.addNumericField("start: ", startImg, 0);
gd.addNumericField("end: ", endImg, 0);
//gd.addNumericField("MaximumFinderNoiseThreshold: ", MaximumFinderNoiseThreshold, 2);
//gd.addNumericField("blurRoiRadius: ", blurRoiRadius, 2);
gd.addMessage("**Particle analyzer settings:");
gd.addNumericField("ROI minimum Size: ", PAminSize, 2);
gd.addNumericField("ROI maximum Size: ", PAmaxSize, 2);
//gd.addNumericField("ROI minimum Circularity: ", PAminCirc, 2);
//gd.addNumericField("ROI maximum Circularity: ", PAmaxCirc, 2);
//gd.addNumericField("Average Image Gaussian Blur: ", AverageImageGaussianBlur, 2);
//gd.addNumericField("times Dilate (make ROIs bigger): ", timesDilate, 0);
gd.addNumericField("Enlargement Factor for rectangle ROIs: ", areaMultiply, 2);
//gd.addNumericField("Noise Threshold for ROI centration: ", centerThreshold, 0);
gd.addMessage("if very bright neurons are present, please enhance contrast");
gd.addCheckbox("enhance Contrast of average Image", enhanceContrastAvgImage);
gd.addNumericField("fraction of saturated pixels (for enhance contrast): ", saturated, 2);
//gd.addNumericField("min Threshold: ", minManThreshold, 2);
//gd.addNumericField("Bright Neuron Threshold: ", brightNeuronThreshold, 2);
//gd.addNumericField("max Threshold: ", maxManThreshold, 2);


//gd.addCheckbox("gaussian Blur for Difference Image", gaussianBlur) ;
//gd.addCheckbox("mask Bright Neurons", maskBrightNeurons) ;
gd.addCheckbox("generate rectangle Rois", rectangleRois) ;
gd.addCheckbox("Watershed (for very close ROIs)", Watershed) ;
//gd.addCheckbox("square Enhance (for noisy images)", sqrEnhance);
//gd.addCheckbox("Linear Noise Substract", LinearNoiseSubstract);

gd.addCheckbox("Show enhnanced difference Image", showEnhnancedDifferenceImage) ;
gd.addCheckbox("Show Average Image", showAverageImage) ;

//gd.addCheckbox("Show (binary) Threshold Image", showThresholdImage) ;
gd.addCheckbox("Auto-save ROIs as ZIP File", autoSaveRois) ;
//gd.addCheckbox("center ROIs using local maximum from difference Image", maxEnhImagePlus) ;
//gd.addCheckbox("Enhance Contrast (if there are very bright AND very dim ROIs)", enhContr) ;
//gd.addCheckbox("manual Threshold", manTreshold) ;
//gd.addCheckbox("use absolute Values in Difference Image", absImage) ;
gd.addCheckbox("actually search ROIs", runParticleAnalyzer);
//gd.addCheckbox("use 'Minimum' threshold method for average image", MinimumThreshold);
var choice = new Array(5);
choice[0]="Default";
choice[1]="Otsu";
choice[2]="Moments";
choice[3]="Triangle";
choice[4]="Minimum";
//gd.addChoice("Auto Threshold Method (difference Image):", choice, choice[2]);


if (!error)
{
gd.showDialog();

if (!gd.wasCanceled())
{
	

//floatNoiseThreshold = gd.getNextNumber();
//blurRadius = gd.getNextNumber();
startImg = gd.getNextNumber();
endImg = gd.getNextNumber();
//MaximumFinderNoiseThreshold = gd.getNextNumber();
//blurRoiRadius = gd.getNextNumber();
PAminSize = gd.getNextNumber();
PAmaxSize = gd.getNextNumber();
//PAminCirc = gd.getNextNumber();
//PAmaxCirc = gd.getNextNumber();
//AverageImageGaussianBlur = gd.getNextNumber();
//timesDilate = gd.getNextNumber();
areaMultiply = gd.getNextNumber();
//centerThreshold = gd.getNextNumber();
enhanceContrastAvgImage = gd.getNextBoolean();
saturated =  gd.getNextNumber();
//minManThreshold =  gd.getNextNumber();
//brightNeuronThreshold =  gd.getNextNumber();
//maxManThreshold =  gd.getNextNumber();

//gaussianBlur = gd.getNextBoolean();
//maskBrightNeurons = gd.getNextBoolean();

rectangleRois = gd.getNextBoolean();
Watershed = gd.getNextBoolean();
//sqrEnhance = gd.getNextBoolean();
//LinearNoiseSubstract = gd.getNextBoolean();

showEnhnancedDifferenceImage = gd.getNextBoolean();
showAverageImage = gd.getNextBoolean();
//showThresholdImage = gd.getNextBoolean();
autoSaveRois = gd.getNextBoolean();
//maxEnhImagePlus = gd.getNextBoolean();
//enhContr = gd.getNextBoolean();
//manTreshold = gd.getNextBoolean();
if ( minManThreshold != 0 ) manTreshold = true;
//absImage = gd.getNextBoolean();
runParticleAnalyzer = gd.getNextBoolean();
//MinimumThreshold = gd.getNextBoolean();
//var method = gd.getNextChoice();
var ThresholdMethod = AutoThresholder.Method.Default;
/*if (method == "Default") var ThresholdMethod = AutoThresholder.Method.Default;
else if(method == "Otsu") var ThresholdMethod = AutoThresholder.Method.Otsu;
else if(method == "Moments") var ThresholdMethod = AutoThresholder.Method.Moments;
else if(method == "Triangle") var ThresholdMethod = AutoThresholder.Method.Triangle;
else if(method == "Minimum") var ThresholdMethod = AutoThresholder.Method.Minimum;
else IJ.error("An error in AutoThreshold Method swich occured!");*/



image = IJ.getImage();
ip = image.getProcessor();


var frames = image.getStackSize();
var path = IJ.getDirectory("image");



var gd;
gd = GenericDialog("Enter stimulation frame");
gd.addNumericField("stimulation frame (frame-nr):", stimulationFrame, 0);

gd.showDialog();

if (!gd.wasCanceled())
{

stimulationFrame = gd.getNextNumber();

//*************Duplictae & Z-Project
dp = Duplicator();
img1=dp.run(image, stimulationFrame-endImg, stimulationFrame-startImg);
img2=dp.run(image, stimulationFrame+startImg, stimulationFrame+endImg);

zp1 = ZProjector(img1);
zp2 = ZProjector(img2);
zp1.setMethod(ZProjector.MEDIAN_METHOD);
zp2.setMethod(ZProjector.MEDIAN_METHOD);
zp1.doProjection();
img3=zp1.getProjection();
zp2.doProjection();
img4=zp2.getProjection();


if(gaussianBlur)
{
	var ip1 = img3.getProcessor();
	var ip2 = img4.getProcessor();
	var gs = new GaussianBlur();
	gs.blurGaussian(ip1,blurRadius,blurRadius,0.001);
	gs.blurGaussian(ip2,blurRadius,blurRadius,0.001);
}
// Difference
ic = new ImageCalculator();
DiffImp = ic.run("Subtract create 32-bit (float)", img4, img3);

var EnhImp = DiffImp.getProcessor().convertToFloat();
var pixel = EnhImp.getPixels();


if (LinearNoiseSubstract)
{
	for (var i = 0; i < pixel.length; i+=1)
	{
		if (EnhImp.get(i) < floatNoiseThreshold)
		{
			EnhImp.setf(i, 0);
		}
	}
}
if (sqrEnhance) EnhImp.sqr();

var minThreshold = 0;
var maxThreshold = 0;

if ( enhContr )
{
	var temp = new ImagePlus("temp", EnhImp);
	var IC = new ImageConverter(temp);
	IC.convertToGray8();
	IJ.run(temp, "Enhance Contrast...", "saturated=" + saturated + " normalize");
	var tempIP = temp.getProcessor();
	if (!manTreshold)
	{
		tempIP.setAutoThreshold(ThresholdMethod, true);
		minThreshold = tempIP.getMinThreshold();
		maxThreshold = tempIP.getMaxThreshold();
	}

	var temp = new ImagePlus("DifferenceImage (enhanced contrast)", tempIP)

	var BinaryIp = tempIP.convertToShort(false);
	if (showEnhnancedDifferenceImage) temp.show();
}
else
{	
	var BinaryIp = EnhImp.convertToByte(false);

	if (!manTreshold)
	{
		BinaryIp.setAutoThreshold(ThresholdMethod, true);
		minThreshold = BinaryIp.getMinThreshold();
		maxThreshold = BinaryIp.getMaxThreshold();
	}
	if (showEnhnancedDifferenceImage) ImagePlus("EnhnancedDifferenceImage", EnhImp).show();	
}
if (manTreshold)
{

	minThreshold = minManThreshold;
	maxThreshold = maxManThreshold;
}

BinaryIp.setThreshold(minThreshold, maxThreshold, ImageProcessor.BLACK_AND_WHITE_LUT);

var BinaryImp = new ImagePlus("threshold1", BinaryIp);	

//img4.getProcessor().invert();

AvgImg = ic.run("Average create 32-bit (float)", BinaryImp, img4);

AvgImg.getProcessor().blurGaussian(AverageImageGaussianBlur);
if (enhanceContrastAvgImage)
{	
	AvgImg.updateImage();
	IJ.run(AvgImg, "Enhance Contrast...", "saturated=" + saturated + " normalize");
	AvgImg.updateImage();
}
if (showAverageImage)
{
	AvgImg.show();
}
if ( MinimumThreshold)
	AvgImg.getProcessor().setAutoThreshold(AutoThresholder.Method.Minimum, false);
else
	AvgImg.getProcessor().setAutoThreshold(AutoThresholder.Method.Moments, true);

//AvgImg.getProcessor().invert();
AvgImg.updateImage();
minThreshold = AvgImg.getProcessor().getMinThreshold();
maxThreshold = AvgImg.getProcessor().getMaxThreshold();
IJ.log("Setting threshold of difference Image to " + minThreshold + "  and " + maxThreshold);
var AverageBinary = AvgImg.getProcessor()

AverageBinary.setThreshold(minThreshold, maxThreshold, ImageProcessor.BLACK_AND_WHITE_LUT);
for (var i = 0; i < timesDilate; i += 1)	AverageBinary.dilate();

var AverageBinaryImp = new ImagePlus("threshold", AverageBinary);	
IJ.run(AverageBinaryImp, "Make Binary", "BlackBackground");

if ( showThresholdImage) BinaryImp.show();
if(Watershed)
{
	EDM().toWatershed(AverageBinaryImp.getProcessor());
}
if ( runParticleAnalyzer)
{	
PA = ParticleAnalyzer(ParticleAnalyzer.EXCLUDE_EDGE_PARTICLES+ParticleAnalyzer.ADD_TO_MANAGER, 0, null, PAminSize, PAmaxSize, PAminCirc, PAmaxCirc);

PA.analyze(AverageBinaryImp);
nRois = rm.getCount();
if (nRois==0) IJ.error("ERROR: found no ROIs");
for (var i = 0; i < nRois; i+=1)
{
	rm.select(i);
	if (RoiManager.getName(i) == "background")
	{
	}
	else
	{
		rm.runCommand("Rename", "roi" + IJ.d2s(i, 0));
	}
}

var rois = rm.getRoisAsArray();

if ( rectangleRois ) 
{
	for (var i = 0; i < nRois; i+=1)
	{

		var xOffset = 0;
		var yOffset = 0;
		var width = 0;

		if (maxEnhImagePlus)
		{
			var imageProcessor = img4.getProcessor();
			imageProcessor.invert();
			var EnhImagePlus = new ImagePlus("EnhImp", imageProcessor);
			EnhImagePlus.setRoi(rois[i]);
			var roiSize = rois[i].getBounds();				
			var stats = EnhImagePlus.getStatistics(Measurements.MIN_MAX+Measurements.CENTER_OF_MASS);		
			width = areaMultiply * Math.sqrt(stats.area);

			xOffset = stats.xCenterOfMass;
			yOffset = stats.yCenterOfMass;

		}
		else
		{
			var stats = BinaryImp.getStatistics(Measurements.MEAN+Measurements.CENTER_OF_MASS);
			width = areaMultiply * Math.sqrt(stats.area);		
			xOffset = stats.xCenterOfMass;
			yOffset = stats.yCenterOfMass;
		}
	
		var rr = new Roi(xOffset-0.5*width, yOffset-0.5*width, width, width);
		rm.select(0);
		rm.runCommand("Delete");
		rm.addRoi(rr);
		ip.setRoi(rr);
	
	}
}

for (var i = 0; i < rm.getCount(); i+=1)
{
	rm.select(i);
	rm.runCommand("Rename","roi"+i);
}

IJ.log("ready, found " + rm.getCount() + " rois");

if (autoSaveRois) rm.runCommand("Save", path + "AutoRoiSet.zip");

}
}
}
}
