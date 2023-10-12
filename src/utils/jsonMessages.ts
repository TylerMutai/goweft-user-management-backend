function jsonMessageResponse(message: string, error?: Array<any> | string) {
  return {
    message,
    error
  }
}