<?php
/************************************
Paul Whitrow - 5th May 2009

GENERIC GD IMAGE FUNCTIONS

_imageGreyScale()
_imageSepia()
_imageTint()
_imageRotate()
_imageResize()
_imageThumbPart()
_imageRoundCorners()
_imageWaterMark()
_imageMergeXY()
_imageShadow()
_imageFlip()
_imageReflect()
_imageTextWrite()
_imageFromString()
_imageBorder()
_imageCrop()
_imageSkew()
_imagePerspective()
_imageBlur()
_imageCopyToType()
_imageOptimize()

see:
http://www.pwhitrow.com/blog/entries/2009/05/27/php-image-library/
for a full description of the functions listed herein.

************************************/


/************************************************/
/* CONVERT HEX TO RGB COLOR CODE */

function _HexToRGB($hex)
{
	$hex = str_replace('#', '', $hex);
	$color = array();
	if(strlen($hex) == 3)
	{
		$color['r'] = hexdec(substr($hex, 0, 1));
		$color['g'] = hexdec(substr($hex, 1, 1));
		$color['b'] = hexdec(substr($hex, 2, 1));
	}
	elseif(strlen($hex) == 6)
	{
		$color['r'] = hexdec(substr($hex, 0, 2));
		$color['g'] = hexdec(substr($hex, 2, 2));
		$color['b'] = hexdec(substr($hex, 4, 2));
	}
	return $color;
}


/************************************************/
/* GET A FILE EXTENSION */

function _getFileExtension($filename)
{
	$ext = explode('.', basename($filename));
	return $ext[count($ext) - 1];
}


/************************************************/
/* GET RGB VALUES FROM HEX COLOR */

function _imageColor($image, $color)
{
	$color = _HexToRGB($color);
	return imagecolorallocate($image, $color['r'], $color['g'], $color['b']);
}


/************************************************/
/* CREATE IMAGE TYPE ACCORDING TO EXTENSION */

function _imageCreateType($source)
{
	$ext = _getFileExtension($source);

	switch($ext)
	{
		case('gif'):
				return imagecreatefromgif($source);
				break;
		case('png'):
				return imagecreatefrompng($source);
				break;
		case('jpg'):
		case('jpeg'):
				return imagecreatefromjpeg($source);
				break;

	}
}


/************************************************/
/* RETURN THE CORRECT IMAGE TYPE FOR THE EXTENSION */

function _imageDisplayType($source, $target)
{
	$ext = _getFileExtension($target);

	switch($ext)
	{
		case('gif'):
				$target = imagegif($source, $target, 80);
				break;
		case('png'):
				$target = imagepng($source, $target, 9.4);
				break;
		case('jpg'):
		case('jpeg'):
				$target = imagejpeg($source, $target, 80);
				break;

	}

	imagedestroy($source);
	return $target;
}

/************************************************/
/* GREYSCALE AN IMAGE (DEFAULT IS GREY) */

function _imageGreyScale($source, $target)
{
	$source = _imageCreateType($source);
	$x = imagesx($source);
	$y = imagesy($source);


	for($i=0; $i<$y; $i++)
	{
		for($j=0; $j < $x; $j++)
		{
			$pos = imagecolorat($source, $j, $i);
			$f = imagecolorsforindex($source, $pos);
			$gst = round((.299 * $f['red']) + (.587 * $f['green']) + (.114 * $f['blue']));
			$col = imagecolorresolve($source, $gst, $gst, $gst);
			imagesetpixel($source, $j, $i, $col);
		}
	}

	return _imageDisplayType($source, $target);
}


/************************************************/
/* TINT AN IMAGE TO SEPIA */

function _imageSepia($source, $target)
{
	$source = _imageCreateType($source);

	if (!($t = imagecolorstotal($source)))
	{
		$t = 256;
		imagetruecolortopalette($source, true, $t);
	}

	$total = imagecolorstotal( $source );

	for ( $i = 0; $i < $total; $i++ )
	{
		$index = imagecolorsforindex( $source, $i );
		$red = ( $index["red"] * 0.393 + $index["green"] * 0.769 + $index["blue"] * 0.189 );
		$green = ( $index["red"] * 0.349 + $index["green"] * 0.686 + $index["blue"] * 0.168 );
		$blue = ( $index["red"] * 0.272 + $index["green"] * 0.534 + $index["blue"] * 0.131 );
		if ($red > 255) { $red = 255; }
		if ($green > 255) { $green = 255; }
		if ($blue > 255) { $blue = 255; }
		imagecolorset( $source, $i, $red, $green, $blue );
	}

	return _imageDisplayType($source, $target);
}


/************************************************/
/* TINT AN IMAGE BY GIVEN COLOR VALUE */

function _imageTint ($source, $target, $tint)
{
	$source = _imageCreateType($source);
	$width = imagesx($source);
	$height = imagesy($source);
	$dest = imagecreate ($width, $height);
	$c = _HexToRGB($tint);

	for ($i=0; $i < 256; $i++)
	{
		imagecolorallocate ($dest, $i, $i, $i);
	}

	imagecopyresized ($dest, $source, 0, 0, 0, 0, $width, $height, $width, $height);

	for ($i = 0; $i < 256; $i++)
	{
		imagecolorset ($dest, $i, min($i * abs($c['r']) / 255, 255), min($i * abs($c['g']) / 255, 255), min($i * abs($c['b']) / 255, 255));
	}

	$source = imagecreate ($width, $height);
	imagecopy ($source, $dest, 0, 0, 0, 0, $width, $height);
	imagedestroy ($dest);

	return _imageDisplayType($source, $target);
}


/************************************************/
/* ROTATE AN IMAGE BY GIVEN DEGREES */

function _imageRotate($source, $target, $degrees, $color)
{
	$source = _imageCreateType($source);
	$color = _imageColor($source, $color);
	$rotate = imagerotate($source, $degrees, $color);
	imagecolortransparent($rotate, $color);

	return _imageDisplayType($rotate, $target);
}

/************************************************/
/* RESIZE AN IMAGE IMAGE BY H OR W AND KEEP ASPECT RATIO */

function _imageResize($source, $target, $w, $h, $aspect="w")
{
	$picsize = getimagesize($source);
	$defWidth = $w;
	$defHeight = $h;
	if($aspect == "h")
	{
		$w = $picsize[0];
		$h = $picsize[1];
		$CalculatedHeight = $h - $defHeight;
		$PercentHeight = ($CalculatedHeight / $h) * 100;
		$WidthDifference = ($w / 100) * $PercentHeight;
		$NewWidth = ($w - $WidthDifference);
		$W = $NewWidth;
		$H = $defHeight;
	}
	else if($aspect == "w")
	{
		$w = $picsize[0];
		$h = $picsize[1];
		$CalculatedWidth = $w - $defWidth;
		$PercentWidth = ($CalculatedWidth / $w) * 100;
		$HeightDifference = ($h / 100) * $PercentWidth;
		$NewHeight = ($h - $HeightDifference);
		$W = $defWidth;
		$H = $NewHeight;
	}
	else
	{
		$W = $defWidth;
		$H = $defHeight;
	}
	$source_x  = $picsize[0];
	$source_y  = $picsize[1];
	$source_id = _imageCreateType($source);
	$target_id = imagecreatetruecolor($W, $H);
	$target_pic = imagecopyresampled($target_id,$source_id,0,0,0,0,$W,$H,$source_x,$source_y);

	return _imageDisplayType($target_id, $target);
}


/************************************************/
/* CREATE A THUMBNAIL BASED ON A PART OF THE IMAGE (CENTER OFFSET) */

function _imageThumbPart($source, $target, $tw, $th)
{
	list($ow, $oh) = getimagesize($source);
	$image = _imageCreateType($source);
	$image_p = imagecreatetruecolor($tw,$th);
	if ($ow > $oh)
	{
		$off_w = ($ow-$oh)/2;
		$off_h = 0;
		$ow = $oh;
	}
	elseif ($oh > $ow)
	{
		$off_w = 0;
		$off_h = ($oh-$ow)/2;
		$oh = $ow;
	}
	else
	{
		$off_w = 0;
		$off_h = 0;
	}

	imagecopyresampled($image_p, $image, 0, 0, $off_w, $off_h, $tw, $th, $ow, $oh);

	return _imageDisplayType($image_p, $target);
}


/************************************************/
/* CREATE A SCALED (MAINTAINED ASPECT RATIO ACCORDING TO MAX HEIGHT) THUMBNAIL */

function _imageThumbScale($source, $target, $imageWidth, $th)
{
	 $picsize = getimagesize($source);
	 $defWidth = $tw;
	 $defHeight = $th;
	 $w = $picsize[0];
	 $h = $picsize[1];
	 $CalculatedHeight = $h - $defHeight;
	 $PercentHeight = ($CalculatedHeight / $h) * 100;
	 $WidthDifference = ($w / 100) * $PercentHeight;
	 $NewWidth = ($w - $WidthDifference);
	 $W = $NewWidth;
	 $H = $defHeight;
	 $source_x  = $picsize[0];
	 $source_y  = $picsize[1];
	 $source_id = _imageCreateType($source);
	 $target_id = imagecreatetruecolor($W, $H);
	 $target_pic = imagecopyresampled($target_id,$source_id,0,0,0,0,$W,$H,$source_x,$source_y);

	return _imageDisplayType($target_id, $target);
}


/************************************************/
/* APPLY A WATERMARK TO THE BOTTOM RIGHT OF AN IMAGE */

function _imageWaterMark($source, $target, $wmFile, $transparency = 25, $margin = 10)
{
	$wmImg = _imageCreateType($wmFile);
	$source = _imageCreateType($source);
	$wmX = (imagesx($source) - imagesx($wmImg)) - $margin;
	$wmY = (imagesy($source) - imagesy($wmImg)) - $margin;
	imagecopymerge($source, $wmImg, $wmX, $wmY, 0, 0, imagesx($wmImg), imagesy($wmImg), $transparency);

	return _imageDisplayType($source, $target);
}


/************************************************/
/* MERGE ONE IMAGE ONTO ANOTHER AT SPECIFIED POINTS */

function _imageMergeXY($source, $target, $merge, $x = 0, $y = 0, $transparency = 100)
{
	$source = _imageCreateType($source);
	$merge = _imageCreateType($merge);
	$w = imagesx($merge);
	$h = imagesy($merge);

	imagecopymerge($source, $merge, $x, $y, 0, 0, $w, $h, $transparency);

	return _imageDisplayType($source, $target);
}


/************************************************/
/* ROUND THE CORNERS OF AN IMAGE */

function _imageRoundCorners($source, $target, $radius, $color)
{
	$source = _imageCreateType($source);
	$width  = imagesx($source);
	$height = imagesy($source);

	// create corner image mask in memory -- a square filled with specified color with a transparent circle inside
	$corner_image = imagecreatetruecolor($radius * 2, $radius * 2);
	$clear_color = imagecolorallocate($corner_image, 0, 0, 0);
	$solid_color = _imageColor($corner_image, $color);
	imagecolortransparent($corner_image, $clear_color);
	imagefill($corner_image, 0, 0, $solid_color);
	imagefilledellipse($corner_image, $radius, $radius, $radius * 2, $radius * 2, $clear_color);

	// render the top-left, top-right, bottom-left, bottom-right corners by copying portions of the mask
	imagecopymerge($source, $corner_image, 0, 0, 0, 0, $radius, $radius, 100);
	imagecopymerge($source, $corner_image, $width - $radius, 0, $radius, 0, $radius, $radius, 100);
	imagecopymerge($source, $corner_image, 0, $height - $radius, 0, $radius, $radius, $radius, 100);
	imagecopymerge($source, $corner_image, $width - $radius, $height - $radius, $radius, $radius, $radius, $radius, 100);

	$color = _imageColor($source, $color);
	imagecolortransparent($source, $color);

	return _imageDisplayType($source, $target);
}


/************************************************/
/* APPLY A DROP SHADOW TO AN IMAGE */

function _imageShadow($source, $target, $offset = 5, $steps = 10, $spread = 1, $bgcolor)
{
	/* PARAMETERS: */
	/* offset of drop shadow from top left */
	/* number of steps from black to background color */
	/* distance between steps */
	/* background canvas color (rgb) */

	$c = _HexToRGB($bgcolor);

	$background = array("r" => $c['r'], "g" => $c['g'], "b" => $c['b']);

	/* create a new canvas. New canvas dimensions should be larger than the original's */
	list($o_width, $o_height) = getimagesize($source);
	$width = $o_width + $offset;
	$height = $o_height + $offset;
	$image = imagecreatetruecolor($width, $height);

	/* determine the offset between colors */
	$step_offset = array("r" => ($background["r"] / $steps), "g" => ($background["g"] / $steps), "b" => ($background["b"] / $steps));

	/* calculate and allocate the needed colors */
	$current_color = $background;
	for ($i = 0; $i <= $steps; $i++)
	{
		$colors[$i] = imagecolorallocate($image, round($current_color["r"]), round($current_color["g"]), round($current_color["b"]));
		$current_color["r"] -= $step_offset["r"];
		$current_color["g"] -= $step_offset["g"];
		$current_color["b"] -= $step_offset["b"];
	}
	/* floodfill the canvas with the background color */
	imagefilledrectangle($image, 0,0, $width, $height, $colors[0]);

	/* draw overlapping rectangles to create a drop shadow effect */
	for ($i = 0; $i < count($colors); $i++)
	{
		imagefilledrectangle($image, $offset, $offset, $width, $height, $colors[$i]);
		$width -= $spread;
		$height -= $spread;
	 }

	 /* overlay the original image on top of the drop shadow */
	$source = imagecreatefromjpeg($source);
	imagecopymerge($image, $source, 0,0, 0,0, $o_width, $o_height, 100);

	$color = _imageColor($image, $bgcolor);
	imagecolortransparent($image, $color);

	return _imageDisplayType($image, $target);
}


/************************************************/
/* INVERT AN IMAGE */

function _imageFlip($source, $target, $mode='')
{
	$source = _imageCreateType($source);
	$width  = imagesx($source);
	$height = imagesy($source);
	$dest   = imagecreatetruecolor($width, $height);

	switch($mode)
	{
		case '':
			return $source;
			break;

		case 'v':
			for($i = 0; $i < $height; $i++)
			{
				imagecopy($dest, $source, 0, ($height - $i - 1), 0, $i, $width, 1);
			}
			break;

		case 'h':
			for($i = 0; $i < $width; $i++)
			{
				imagecopy($dest, $source, ($width - $i - 1), 0, $i, 0, 1, $height);
			}
			break;

		case 'both':
			for($i = 0; $i < $width; $i++)
			{
				imagecopy($dest, $source, ($width - $i - 1), 0, $i, 0, 1, $height);
			}
			$buffer = imagecreatetruecolor($width, 1);
			for($i = 0; $i < ($height/2); $i++)
			{
				imagecopy($buffer, $dest, 0, 0, 0, ($height - $i -1), $width, 1);
				imagecopy($dest, $dest, 0, ($height - $i - 1), 0, $i, $width, 1);
				imagecopy($dest, $buffer, 0, $i, 0, 0, $width, 1);
			}
			imagedestroy($buffer);
			break;
	}

	return _imageDisplayType($dest, $target);
}


/************************************************/
/* REFLECT AN IMAGE */

function _imageReflect($source, $target, $colorfade = '000000', $divheight = 0, $fadeheight = 80, $fadestart = 30)
{
	$ext = _getFileExtension($source);
	$tmpfile = 'tmp.'.$ext;

	$size = getimagesize($source);
	$w = $size[0];
	$h = $size[1];
	$tr = $fadestart;  // Starting transparency
	$rH = $fadeheight; // Reflection height
	$div = $divheight; // Size of the divider line

	// crop and flip the original image for use as reflection
	_imageCrop($source, $tmpfile, 0, ($h-$fadeheight), $w, $fadeheight);
	_imageFlip($tmpfile, $tmpfile, 'v');

	// set image resources
	$source = _imageCreateType($source);
	$fade = _imageCreateType($tmpfile);

	// create the reflection and combine it with the cropped image
	$li = imagecreatetruecolor($w, $h);
	$bgc = _imageColor($li, $colorfade);
	imagefilledrectangle($li, 0, 0, $w, 1, $bgc);

	$image  = imagecreatetruecolor($w, $fadeheight);

	// fade reflection
	$in = 100/$rH;
	for($i=0; $i <= $rH; $i++)
	{
		if($tr > 100) $tr = 100;
		imagecopymerge($fade, $li, 0, $i, 0, 0, $w, 1, $tr);
		$tr += $in;
	}

	$finaloutput = imagecreatetruecolor($w, $h + $fadeheight);

	imagecopy($finaloutput, $source, 0, 0, 0, $divheight, $w, $h);
	imagecopy($finaloutput, $fade, 0, $h, 0, 0, $w, $h);

	unlink($tmpfile);

	$color = _imageColor($finaloutput, $colorfade);
	imagecolortransparent($finaloutput, $color);

	return _imageDisplayType($finaloutput, $target);


}

/************************************************/
/* CROP AN IMAGE */

function _imageCrop($source, $target, $x=0, $y=0, $w, $h)
{
	$image = _imageCreateType($source);
	$crop = imagecreatetruecolor($w, $h);
	imagecopy ( $crop, $image, 0, 0, $x, $y, $w, $h );
	return _imageDisplayType($crop, $target);
}

/************************************************/
/* SKEW AN IMAGE */

function _imageSkew($source, $target, $deg, $dir, $bgcolor)
{
	$source = _imageCreateType($source);
	$w = imagesx($source);
	$h = imagesy($source);

	$new_h = ($w * $deg) + $h;
	$new = imagecreatetruecolor($w, $new_h);
	$bg = _imageColor($new, $bgcolor);
	imagefill($new, 0, 0, $bg);

	if($dir == 'left')
	{
		$z = ($w * $deg);

		for($x=0; $x < $w; $x++)
		{
			for($y=0; $y < $h; $y++)
			{
				$col = imagecolorat($source, $x, $y);
				imagesetpixel($new, $x, ($y + $z), $col);
			}

			$z -= $deg;
		}
	}

	if($dir == 'right')
	{
		$z = 0;

		for($x=0; $x < $w; $x++)
		{
			for($y=0; $y < $h; $y++)
			{
				$col = imagecolorat($source, $x, $y);
				imagesetpixel($new, $x, ($y + $z), $col);
			}

			$z += $deg;
		}
	}

	imageColorTransparent($new, $bg);

	$color = _imageColor($new, $bgcolor);
	imagecolortransparent($new, $color);

	return _imageDisplayType($new, $target);
}


/************************************************/
/* PERSPECTIVE AN IMAGE */

function _imagePerspective($source, $target, $angle, $dir, $bgcolor)
{
	list($width, $height, $type, $attr) = getimagesize($source);

	$source = _imageCreateType($source);

	$image = imagecreate($width, $height);
	$bg = _imageColor($image, $bgcolor);
	imagefill($image, 0, 0, $bg);

	$diff = ($angle / 90);

	$currentHeight = $height;
	$currentY = 0;

	if ($dir == 1)
	{
		$currentHeight = 0;
		$currentY = $height;
	}

	for ($i = 0; $i < $width; $i++)
	{
		if ($dir == 0)
		{
			imagecopyresampled($image, $source, $i, $currentY, $i, 0, 1, $currentHeight, 1, $height);
		}
		else
		{
			imagecopyresampled($image, $source, ($width - $i), $currentY, ($width - $i), 0, 1, $currentHeight, 1, $height);
		}

		if ($dir == 0)
		{
			$currentHeight = $currentHeight - ($diff * 2);
			$currentY = ($height - $currentHeight) / 2;
		}
		else
		{
			$currentHeight = $height - ( $i * ($diff * 2) );
			$currentY = ($height - $currentHeight) / 2;
		}
	}

	$color = _imageColor($image, $bgcolor);
	imagecolortransparent($image, $color);

	return _imageDisplayType($image, $target);
}


/************************************************/
/* WRITE CENTERED TEXT ONTO AN IMAGE WITH AN OPTIONAL DROP SHADOW */

function _imageTextWrite($source, $target, $text, $font = 'AUGUSTUS.TTF', $fontsize = 24, $color = 'FFFFFF', $bgcolor = false)
{
	$source = _imageCreateType($source);
	$bbox = imagettfbbox($fontsize, 0, $font, $text);
	$x = $bbox[0] + (imagesx($source) / 2) - ($bbox[4] / 2);
	$y = $bbox[1] + (imagesy($source) / 2) - ($bbox[5] / 2);

	if(!empty($bgcolor))
	{
		// shadow text
		$bgcolor = _imageColor($source, $bgcolor);
		imagettftext($source, $fontsize, 0, $x + 2, $y + 2, $bgcolor, $font, $text);
	}

	// main text
	$color = _imageColor($source, $color);
	imagettftext($source, $fontsize, 0, $x, $y, $color, $font, $text);

	return _imageDisplayType($source, $target);
}


/************************************************/
/* CREATE AN IMAGE FROM TEXT */

function _imageFromString($target, $text, $font = 'AUGUSTUS.TTF', $fontsize = 24, $color = '000000', $bgcolor = 'FFFFFF')
{

	$bbox = imagettfbbox($fontsize, 0, $font, $text);
	$w = abs($bbox[0]) + abs($bbox[2]); // distance from left to right
	$h = abs($bbox[1]) + abs($bbox[5]); // distance from top to bottom

	$image = imagecreatetruecolor($w, $h);
	$bg = _imageColor($image, $bgcolor);
	$color = _imageColor($image, $color);
	imagefill($image, 0, 0, $bg);

	imagefttext($image, $fontsize, 0, 0, ($h-1), $color, $font, $text);

	return _imageDisplayType($image, $target);

}


/************************************************/
/* PLACE A BORDER AROUND AN IMAGE */

function _imageBorder($source, $target, $borderwidth = 4, $bordercolor = '000000')
{
	$source = _imageCreateType($source);
	$width = imagesx($source);
	$height = imagesy($source);

	$createdimg = imagecreatetruecolor($width, $height);
	imagecopyresampled($createdimg, $source, 0, 0, 0, 0, $width, $height, $width, $height);

	// Create border around image
	$bordercolor = _imageColor($createdimg, $bordercolor);
	for($i = 0; $i < $borderwidth; $i++)
	{
		// top
		imageline($createdimg, 0, $i, $width, $i, $bordercolor);
		// left
		imageline($createdimg, $i, 0, $i, $height, $bordercolor);
		// right
		imageline($createdimg, $width-$i, 0, $width-$i, $height-1, $bordercolor);
		// bottom
		imageline($createdimg, 0, $height-$i, $width-1, $height-$i, $bordercolor);
	}

	return _imageDisplayType($createdimg, $target);
}


/************************************************/
/* BLUR AN IMAGE */

function _imageBlur($source, $target)
{
	$amount = 5;
	$source = _imageCreateType($source);
	$w = imagesx($source);
	$h = imagesy($source);

	$temp_im = imagecreatetruecolor($w,$h);

	// blur by merging with itself at different x/y offsets:

    for ($i=0; $i < $amount; $i++)
    {
		imagecopy      ($temp_im, $source, 0, 0, 1, 1, $w - 1, $h - ($amount*$i)); // up left
		imagecopymerge ($temp_im, $source, $i, 0, 0, 0, $w, $h, ($amount*$i)); // down right
		imagecopymerge ($temp_im, $source, 0, $i, 1, 0, $w - 1, $h, ($amount*$i)); // down left
		imagecopymerge ($temp_im, $source, $i, 0, 0, 1, $w, $h - 1, ($amount*$i)); // up right
		imagecopymerge ($temp_im, $source, 0, $i, 0, 1, $w, $h - 1, ($amount*$i)); // up
		imagecopymerge ($temp_im, $source, $i, 0, 1, 0, $w - 1, $h, ($amount*$i)); // left
		imagecopymerge ($temp_im, $source, 0, $i, 0, 0, $w, $h, ($amount*$i)); // center
		imagecopymerge ($temp_im, $source, $i, 0, 0, 0, $w, $h, ($amount*$i)); // down
		imagecopymerge ($temp_im, $source, 0, $i, 0, 0, $w, $h, ($amount*$i)); // right
    }

	return _imageDisplayType($temp_im, $target);
}


/************************************************/
/* COPY AN IMAGE OR CHANGE IT'S TYPE */

function _imageCopyToType($source, $target)
{
	$source = _imageCreateType($source);
	return _imageDisplayType($source, $target);
}

/************************************************/
/* OPTIMIZE AN IMAGE BY CALLING EXISTING ROUTINES */

function _imageOptimize($source, $target)
{
	_imageCopyToType($source, $target);
}


?>