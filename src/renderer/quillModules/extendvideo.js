import Quill from 'quill'

const VideoFormatAttributesList = [
  'height',
  'width',
  'style'
]

var BaseVideoFormat = Quill.import('formats/video')
class VideoFormat extends BaseVideoFormat {
  static formats (domNode) {
    return VideoFormatAttributesList.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }
      return formats
    }, {})
  }
  format (name, value) {
    if (VideoFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value)
      } else {
        this.domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }
}

export default VideoFormat
