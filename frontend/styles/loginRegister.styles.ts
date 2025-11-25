import { StyleSheet } from 'react-native';

export const loginRegisterStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 25,
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
  },
  toggleButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  toggleButtonText: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
  formContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
    fontSize: 16,
    color: '#2C3E50',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  helperText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  helperLink: {
    fontSize: 14,
    color: '#0a7ea4',
    marginLeft: 6,
    fontWeight: '600',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 13,
    marginBottom: 8,
  },
});