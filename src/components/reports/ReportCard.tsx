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
        paddingBottom: 15,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
    },
    schoolName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2563eb',
        textTransform: 'uppercase',
    },
    schoolInfo: {
        fontSize: 8,
        color: '#64748b',
        marginTop: 2,
    },
    titleContainer: {
        textAlign: 'center',
        marginBottom: 25,
        backgroundColor: '#f1f5f9',
        padding: 8,
        borderRadius: 4,
    },
    reportTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: '#334155',
    },
    studentSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 15,
        borderRadius: 8,
        marginBottom: 25,
    },
    infoBox: {
        width: '30%',
        marginBottom: 5,
    },
    label: {
        fontSize: 7,
        color: '#94a3b8',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    value: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    table: {
        width: 'auto',
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        color: 'white',
        padding: 10,
        fontWeight: 'bold',
        borderRadius: 4,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        padding: 10,
        alignItems: 'center',
    },
    colSubject: { width: '50%' },
    colAverage: { width: '25%', textAlign: 'center' },
    colStatus: { width: '25%', textAlign: 'right' },
    colHeaderText: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    observationsSection: {
        marginTop: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        backgroundColor: '#fafafa',
    },
    observationsTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#475569',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    observationsText: {
        fontSize: 9,
        color: '#334155',
        lineHeight: 1.4,
        fontStyle: 'italic',
    },
    signaturesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 60,
    },
    signatureBox: {
        width: '40%',
        alignItems: 'center',
    },
    signatureLine: {
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#94a3b8',
        marginBottom: 5,
    },
    signatureText: {
        fontSize: 8,
        color: '#64748b',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 7,
        color: '#94a3b8',
    },
    gradeEmerald: { color: '#059669', fontWeight: 'bold' },
    gradeRed: { color: '#dc2626', fontWeight: 'bold' },
});

interface ReportCardProps {
    studentName: string;
    studentId: string;
    overallAverage: string;
    period?: number;
    year?: string;
    subjects: {
        name: string;
        average: string;
    }[];
    observations?: string;
}

export const ReportCard = ({
    studentName,
    studentId,
    overallAverage,
    subjects,
    observations = "Sin observaciones adicionales reportadas por el cuerpo docente.",
    period = 1,
    year = "2024"
}: ReportCardProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Encabezado Institucional */}
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.schoolName}>Colegio Pedagógico Emmanuel</Text>
                    <Text style={styles.schoolInfo}>"Luz y Esperanza" • Floridablanca, Santander</Text>
                    <Text style={styles.schoolInfo}>Resolución SE 1234 de 2010 • DANE: 1234567890 • NIT: 900.123.456-1</Text>
                </View>
                <View style={{ textAlign: 'right' }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#2563eb' }}>COEM</Text>
                </View>
            </View>

            {/* Título del Reporte */}
            <View style={styles.titleContainer}>
                <Text style={styles.reportTitle}>Boletín de Desempeño Académico</Text>
                <Text style={{ fontSize: 8, color: '#64748b', marginTop: 4 }}>Periodo {period} - Año Lectivo {year}</Text>
            </View>

            {/* Información del Estudiante */}
            <View style={styles.studentSection}>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Estudiante</Text>
                    <Text style={styles.value}>{studentName}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>ID Estudiantil</Text>
                    <Text style={styles.value}>{studentId.toUpperCase().slice(-10)}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Sede / Jornada</Text>
                    <Text style={styles.value}>Principal / Única</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Grado</Text>
                    <Text style={styles.value}>Octavo (8°)</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Promedio Periodo</Text>
                    <Text style={{ ...styles.value, color: '#2563eb', fontSize: 12 }}>{overallAverage}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Puesto</Text>
                    <Text style={styles.value}>--</Text>
                </View>
            </View>

            {/* Tabla de Calificaciones */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={{ ...styles.colSubject, ...styles.colHeaderText }}>Materia / Área de Conocimiento</Text>
                    <Text style={{ ...styles.colAverage, ...styles.colHeaderText }}>Promedio</Text>
                    <Text style={{ ...styles.colStatus, ...styles.colHeaderText }}>Valoración</Text>
                </View>

                {subjects.map((subject, index) => {
                    const avg = parseFloat(subject.average);
                    return (
                        <View key={index} style={styles.tableRow} wrap={false}>
                            <Text style={{ ...styles.colSubject, fontWeight: 'bold' }}>{subject.name}</Text>
                            <Text style={{
                                ...styles.colAverage,
                                ...avg >= 6 ? styles.gradeEmerald : styles.gradeRed
                            }}>
                                {subject.average}
                            </Text>
                            <Text style={{
                                ...styles.colStatus,
                                fontSize: 8,
                                ...avg >= 6 ? styles.gradeEmerald : styles.gradeRed
                            }}>
                                {avg >= 9 ? 'EXCELENTE' : avg >= 8 ? 'SOBRESALIENTE' : avg >= 6 ? 'ACEPTABLE' : 'INSUFICIENTE'}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* Observaciones Generales */}
            <View style={styles.observationsSection} wrap={false}>
                <Text style={styles.observationsTitle}>Observaciones del Director de Grupo</Text>
                <Text style={styles.observationsText}>{observations}</Text>
            </View>

            {/* Sección de Firmas */}
            <View style={styles.signaturesContainer} wrap={false}>
                <View style={styles.signatureBox}>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureText}>Firmado en Original</Text>
                    <Text style={{ ...styles.signatureText, fontWeight: 'bold' }}>RECTORÍA / COORDINACIÓN</Text>
                </View>
                <View style={styles.signatureBox}>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureText}>Firma del Acudiente</Text>
                    <Text style={{ ...styles.signatureText, fontWeight: 'bold' }}>C.C. No. ________________</Text>
                </View>
            </View>

            {/* Información de Seguridad y Pie de Página */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    * Documento informativo oficial del Colegio Pedagógico Emmanuel.
                </Text>
                <Text style={styles.footerText}>
                    Consultado el: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                </Text>
            </View>
        </Page>
    </Document>
);
