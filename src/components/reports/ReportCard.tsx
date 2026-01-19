import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Registrar fuentes si fuera necesario (opcional)

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: '#1e293b',
    },
    header: {
        flexDirection: 'row',
        borderBottom: 2,
        borderBottomColor: '#2563eb', // Azul COEM
        paddingBottom: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
    },
    headerText: {
        marginLeft: 15,
        flex: 1,
    },
    schoolName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2563eb',
    },
    schoolInfo: {
        fontSize: 8,
        color: '#64748b',
        marginTop: 2,
    },
    titleContainer: {
        textAlign: 'center',
        marginBottom: 20,
    },
    reportTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    studentSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 5,
        marginBottom: 20,
    },
    studentInfo: {
        flexDirection: 'column',
        gap: 4,
    },
    label: {
        fontSize: 8,
        color: '#64748b',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    table: {
        width: 'auto',
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#2563eb',
        color: 'white',
        padding: 8,
        fontWeight: 'bold',
        borderRadius: 2,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        padding: 8,
        alignItems: 'center',
    },
    colSubject: { width: '60%' },
    colAverage: { width: '20%', textAlign: 'center' },
    colStatus: { width: '20%', textAlign: 'right' },
    colHeaderText: {
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signature: {
        width: 150,
        borderTopWidth: 1,
        borderTopColor: '#1e293b',
        marginTop: 40,
        textAlign: 'center',
        fontSize: 9,
        paddingTop: 5,
    },
    gradeEmerald: { color: '#059669' },
    gradeRed: { color: '#dc2626' },
});

interface ReportCardProps {
    studentName: string;
    studentId: string;
    overallAverage: string;
    subjects: {
        name: string;
        average: string;
    }[];
}

export const ReportCard = ({ studentName, studentId, overallAverage, subjects }: ReportCardProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Encabezado */}
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.schoolName}>Colegio Pedagógico Emmanuel</Text>
                    <Text style={styles.schoolInfo}>Luz y Esperanza • Floridablanca, Santander</Text>
                    <Text style={styles.schoolInfo}>Resolución SE 1234 de 2010 • DANE: 1234567890</Text>
                </View>
            </View>

            {/* Título */}
            <View style={styles.titleContainer}>
                <Text style={styles.reportTitle}>Boletín Informativo de Calificaciones</Text>
            </View>

            {/* Info Estudiante */}
            <View style={styles.studentSection}>
                <View style={styles.studentInfo}>
                    <Text style={styles.label}>Estudiante</Text>
                    <Text style={styles.value}>{studentName}</Text>
                </View>
                <View style={styles.studentInfo}>
                    <Text style={styles.label}>Código</Text>
                    <Text style={styles.value}>{studentId.slice(0, 8)}</Text>
                </View>
                <View style={styles.studentInfo}>
                    <Text style={{ ...styles.label, textAlign: 'right' }}>Promedio General</Text>
                    <Text style={{ ...styles.value, textAlign: 'right', fontSize: 16, color: '#2563eb' }}>{overallAverage}</Text>
                </View>
            </View>

            {/* Tabla de Resultados */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={{ ...styles.colSubject, ...styles.colHeaderText }}>Materia / Área</Text>
                    <Text style={{ ...styles.colAverage, ...styles.colHeaderText }}>Promedio</Text>
                    <Text style={{ ...styles.colStatus, ...styles.colHeaderText }}>Estado</Text>
                </View>

                {subjects.map((subject, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={{ ...styles.colSubject, fontWeight: 'bold' }}>{subject.name}</Text>
                        <Text style={{
                            ...styles.colAverage,
                            ...parseFloat(subject.average) >= 6 ? styles.gradeEmerald : styles.gradeRed
                        }}>
                            {subject.average}
                        </Text>
                        <Text style={{
                            ...styles.colStatus,
                            fontSize: 8,
                            ...parseFloat(subject.average) >= 6 ? styles.gradeEmerald : styles.gradeRed
                        }}>
                            {parseFloat(subject.average) >= 6 ? 'APROBADO' : 'REPROBADO'}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Firmas */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 50 }}>
                <View style={styles.signature}>
                    <Text>Firma del Rector/a</Text>
                </View>
                <View style={styles.signature}>
                    <Text>Firma del Acudiente</Text>
                </View>
            </View>

            {/* Pie de página legal */}
            <View style={styles.footer}>
                <Text style={{ fontSize: 7, color: '#94a3b8' }}>
                    Este documento es un reporte informativo generado automáticamente por la plataforma COEM.
                </Text>
                <Text style={{ fontSize: 7, color: '#94a3b8' }}>
                    Fecha de generación: {new Date().toLocaleDateString('es-ES')}
                </Text>
            </View>
        </Page>
    </Document>
);
